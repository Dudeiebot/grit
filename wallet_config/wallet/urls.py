from django.urls import path
from .views import (
    WalletDetailView,
    TransactionListView,
    FundWalletView,
    VerifyTransactionView,
    MonnifyWebhookView,
)

urlpatterns = [
    path("", WalletDetailView.as_view(), name="wallet-detail"),
    path("/transactions", TransactionListView.as_view(), name="transaction-list"),
    path("/fund", FundWalletView.as_view(), name="fund-wallet"),
    path(
        "/verify/<str:reference>",
        VerifyTransactionView.as_view(),
        name="verify-transaction",
    ),
    path("/webhook/monnify", MonnifyWebhookView.as_view(), name="monnify-webhook"),
]
