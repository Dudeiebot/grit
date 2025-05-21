import base64
import requests
import hmac
import hashlib
from django.conf import settings


def get_monnify_auth_token():
    """Get Monnify API authentication token"""
    credentials = f"{settings.MONNIFY_API_KEY}:{settings.MONNIFY_SECRET_KEY}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        f"{settings.MONNIFY_BASE_URL}/api/v1/auth/login", headers=headers
    )

    if response.status_code == 200:
        return response.json()["responseBody"]["accessToken"]
    return None


def verify_signature(request_body, signature_header):
    """Verify Monnify webhook signature"""
    computed_signature = hmac.new(
        settings.MONNIFY_SECRET_KEY.encode(), request_body, hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(computed_signature, signature_header)
