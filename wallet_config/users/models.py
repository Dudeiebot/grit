from django.contrib.auth.hashers import (
    check_password,
    make_password,
)
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser
from base.models import BaseModel


class User(BaseModel, AbstractBaseUser):
    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)
    name = models.CharField(_("name"), max_length=150, blank=True)
    password = models.CharField(_("password"), max_length=128, blank=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def clean(self):
        super().clean()
        self.email = self.email.lower()

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Return a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """

        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=["password"])

        return check_password(raw_password, self.password, setter)

    def __str__(self):
        return f"User(uid={self.uid}, email={self.email})"
