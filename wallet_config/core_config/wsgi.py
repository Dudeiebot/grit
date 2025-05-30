"""
WSGI config for wallet_config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

settings_module = os.environ.get("DJANGO_SETTINGS_MODULE")
if not settings_module:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core_config.settings.dev")

application = get_wsgi_application()
