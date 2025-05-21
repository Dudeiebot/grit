from django.apps import AppConfig


class WalletConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "wallet"

    def ready(self):
        print("Wallet app ready — signals imported")
        import wallet.signals
