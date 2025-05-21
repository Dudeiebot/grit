from rest_framework import serializers
from .models import User
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    email = serializers.EmailField(required=True)
    uid = serializers.UUIDField(read_only=True)

    class Meta:
        model = User
        fields = ("uid", "name", "email", "password")
        read_only_fields = ["uid"]

    def validate_email(self, email: str):
        if isinstance(email, str):
            email = email.lower()
        return email

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = self.Meta.model.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user


class CustomJSONWebTokenSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)

        email = attrs.get("email")
        password = attrs.get("password")

        if not (email and password):
            raise serializers.ValidationError(_("Must include 'email' and 'password'."))

        user = authenticate(
            request=self.context.get("request"), email=email, password=password
        )

        if not user:
            raise serializers.ValidationError(
                _("Unable to log in with provided credentials.")
            )

        if hasattr(user, "disabled") and user.disabled:
            raise serializers.ValidationError(
                _("Account is disabled. Please contact support for assistance.")
            )
        refresh = self.get_token(user)
        serialized_data = UserSerializer(user).data

        serialized_data.update(
            {
                "refreshToken": str(refresh),
                "accessToken": str(refresh.access_token),
                "last_login": timezone.now(),
            }
        )

        data.pop("refresh", None)
        data.pop("access", None)

        serialized_data.update(data)
        return serialized_data
