from rest_framework import serializers
from .models import Wallet, Transaction


class WalletSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = (
            "name",
            "balance",
            "created_at",
            "updated_at",
        )

    def get_name(self, instance):
        return instance.user.name


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "uid",
            "amount",
            "reference",
            "status",
            "payment_method",
            "monnify_transaction_reference",
            "created_at",
            "updated_at",
        )


class FundWalletSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=1)
    redirect_url = serializers.URLField(required=False)
