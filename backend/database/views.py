import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Account


@csrf_exempt
@require_POST
def login(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return JsonResponse(
            {"error": "Both email and password are required"},
            status=400,
        )

    account = Account.objects.filter(email__iexact=email).first()

    if account is None:
        return JsonResponse({"error": "Account not found"}, status=404)

    if account.password != password:
        return JsonResponse({"error": "Invalid password"}, status=401)

    return JsonResponse(
        {
            "message": "Login successful",
            "email": account.email,
            "account_type": account.account_type,
        },
        status=200,
    )