import uuid
import json
import requests
from decimal import Decimal
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction, TransactionStatus
from .serializers import WalletSerializer, TransactionSerializer, FundWalletSerializer
from .service import get_monnify_auth_token, verify_signature


class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.get(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)


class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.get(user=request.user)
        transactions = Transaction.objects.filter(wallet=wallet).order_by("-created_at")
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class FundWalletView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FundWalletSerializer(data=request.data)

        if serializer.is_valid():
            wallet = Wallet.objects.get(user=request.user)
            amount = serializer.validated_data["amount"]
            reference = f"DEXTER-WALLET-{uuid.uuid4()}"
            redirect_url = serializer.validated_data.get(
                "redirect_url",
                f"{request.scheme}://{request.get_host()}/payment/callback",
            )
            transaction = Transaction.objects.create(
                wallet=wallet,
                amount=amount,
                reference=reference,
                status=TransactionStatus.PENDING,
            )

            auth_token = get_monnify_auth_token()
            if not auth_token:
                return Response(
                    {"error": "Failed to authenticate with payment gateway"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            headers = {
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json",
            }

            payload = {
                "amount": float(amount),
                "customerName": request.user.name,
                "customerEmail": request.user.email,
                "paymentReference": reference,
                "paymentDescription": f"Wallet funding: {reference}",
                "currencyCode": "NGN",
                "contractCode": settings.MONNIFY_CONTRACT_CODE,
                "redirectUrl": redirect_url,
                "paymentMethods": ["CARD", "ACCOUNT_TRANSFER"],
            }

            response = requests.post(
                f"{settings.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction",
                headers=headers,
                json=payload,
            )

            if response.status_code == 200:
                response_data = response.json()
                checkout_url = response_data["responseBody"]["checkoutUrl"]

                transaction.monnify_transaction_reference = response_data[
                    "responseBody"
                ]["transactionReference"]
                transaction.payment_reference = reference
                transaction.save()

                return Response(
                    {"checkout_url": checkout_url, "transaction_reference": reference}
                )
            else:
                transaction.status = TransactionStatus.FAILED
                transaction.save()

                return Response(
                    {"error": "Failed to initialize payment"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        try:
            transaction = Transaction.objects.get(
                reference=reference, wallet__user=request.user
            )
        except Transaction.DoesNotExist:
            return Response(
                {"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND
            )

        auth_token = get_monnify_auth_token()
        if not auth_token:
            return Response(
                {"error": "Failed to authenticate with payment gateway"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Verify transaction with Monnify
        headers = {"Authorization": f"Bearer {auth_token}"}

        response = requests.get(
            f"{settings.MONNIFY_BASE_URL}/api/v1/merchant/transactions/query?paymentReference={reference}",
            headers=headers,
        )

        if response.status_code == 200:
            response_data = response.json()
            payment_status = response_data["responseBody"].get("paymentStatus")

            if payment_status == "PAID":
                # Update transaction status
                transaction.status = TransactionStatus.COMPLETED
                transaction.payment_method = response_data["responseBody"].get(
                    "paymentMethod"
                )
                transaction.save()

                # Update wallet balance
                wallet = transaction.wallet
                wallet.balance += Decimal(str(transaction.amount))
                wallet.save()

                return Response(
                    {
                        "message": "Payment verified successfully",
                        "transaction": TransactionSerializer(transaction).data,
                        "wallet": WalletSerializer(wallet).data,
                    }
                )
            else:
                return Response(
                    {
                        "message": "Payment not completed",
                        "status": payment_status,
                        "transaction": TransactionSerializer(transaction).data,
                    }
                )

        return Response(
            {"error": "Failed to verify payment"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class MonnifyWebhookView(APIView):

    @method_decorator(csrf_exempt, name="dispatch")
    def post(self, request):
        signature_header = request.headers.get("monnify-signature")
        if not signature_header:
            return HttpResponse(status=400)

        request_body = request.body
        if not verify_signature(request_body, signature_header):
            return HttpResponse(status=400)

        try:
            payload = json.loads(request_body)
            event_type = payload.get("eventType")

            if event_type == "SUCCESSFUL_TRANSACTION":
                event_data = payload.get("eventData", {})
                payment_reference = event_data.get("paymentReference")
                amount = event_data.get("amountPaid")
                payment_method = event_data.get("paymentMethod")

                try:
                    transaction = Transaction.objects.get(reference=payment_reference)

                    # Only process if transaction is still pending
                    if transaction.status == TransactionStatus.PENDING:
                        transaction.status = TransactionStatus.COMPLETED
                        transaction.payment_method = payment_method
                        transaction.save()

                        # Update wallet balance
                        wallet = transaction.wallet
                        wallet.balance += Decimal(str(amount))
                        wallet.save()

                    return HttpResponse(status=200)

                except Transaction.DoesNotExist:
                    return HttpResponse(status=404)

            return HttpResponse(status=200)

        except json.JSONDecodeError:
            return HttpResponse(status=400)


# Create your views here.
