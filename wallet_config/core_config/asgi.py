"""
ASGI config for wallet_config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

settings_module = os.environ.get("DJANGO_SETTINGS_MODULE")
if not settings_module:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core_config.settings.dev")

application = get_asgi_application()
