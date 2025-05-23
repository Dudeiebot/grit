# Generated by Django 5.2.1 on 2025-05-19 18:41

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Wallet",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, db_index=True, null=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, db_index=True, null=True),
                ),
                ("is_deleted", models.BooleanField(default=False)),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, null=True, verbose_name="deleted"),
                ),
                (
                    "balance",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, db_index=True, null=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, db_index=True, null=True),
                ),
                ("is_deleted", models.BooleanField(default=False)),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, null=True, verbose_name="deleted"),
                ),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("reference", models.CharField(max_length=255, unique=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Pending", "Pending"),
                            ("Completed", "Completed"),
                            ("Failed", "Failed"),
                        ],
                        default="Pending",
                        max_length=20,
                    ),
                ),
                (
                    "payment_method",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                (
                    "monnify_transaction_reference",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "payment_reference",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("metadata", models.JSONField(blank=True, null=True)),
                (
                    "wallet",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="transactions",
                        to="wallet.wallet",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
