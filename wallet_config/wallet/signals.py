from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Wallet
from django.conf import settings


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_wallet(sender, instance, created, **kwargs):
    print("Signal fired!")
    if created:
        Wallet.objects.create(user=instance)
