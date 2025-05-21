# Create your views here.
import logging
from django.db import transaction
from .serializers import (
    UserSerializer,
    CustomJSONWebTokenSerializer,
)
from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated, AllowAny
from core_config.backends import CustomJWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes


logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomJSONWebTokenSerializer

    def post(self, request, *args, **kwargs) -> Response:
        return super().post(request, *args, **kwargs)


class CustomTokenRefreshView(TokenRefreshView):
    pass


@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
class UserLogoutView(APIView):

    def post(self, request):
        try:
            access_token = request.auth
            return Response(
                {"detail": _("Successfully logged out.")}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": _("Invalid token or token not provided.")},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response_data = {
                "user": serializer.data,
                "accessToken": str(access),
                "refreshToken": str(refresh),
                "message": _("Registration successful"),
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Registration failed: {str(e)}")
            return Response(
                {
                    "error": _("Registration failed. Please try again."),
                    "message error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        user = request.user
        data = request.data.copy()

        if "password" in data:
            return Response(
                {"error": _("Password cannot be updated via this endpoint.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = UserSerializer(user, data=data, partial=True)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            serializer.save()
            return Response(
                {
                    "message": _("User details updated successfully"),
                    "user": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Error updating user details: {str(e)}")
            return Response(
                {"error": _("Update failed. Please try again.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# Create your views here.
