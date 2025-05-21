from django.db import models
from users.models import User
from base.models import BaseModel


class TransactionStatus(models.TextChoices):
    PENDING = "Pending", ("Pending")
    COMPLETED = "Completed", ("Completed")
    FAILED = "Failed", ("Failed")


class Wallet(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.name}'s Wallet: ₦{self.balance}"


class Transaction(BaseModel):
    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, related_name="transactions"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference = models.CharField(max_length=255, unique=True)
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
    )
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    monnify_transaction_reference = models.CharField(
        max_length=255, null=True, blank=True
    )
    payment_reference = models.CharField(max_length=255, null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Transaction {self.reference}: ₦{self.amount} - {self.status}"


# Create your models here.
