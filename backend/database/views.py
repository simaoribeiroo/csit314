import json

from django.http import JsonResponse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from .models import Account, Company, Candidate



def _create_account(email, password, account_type):
    if Account.objects.filter(email__iexact=email).exists():
        return None

    return Account.objects.create(
        email=email,
        password=password,
        account_type=account_type,
    )

def _create_company_account(email, company_name, company_information):
    if Company.objects.filter(email__iexact=email).exists():
        return None

    return Company.objects.create(
        email=email,
        company_name=company_name,
        company_information=company_information,
    )


def _create_candidate_record(email, full_name, phone_number, university, degree_name, years_of_experience, skills, preferred_working_mode, preferred_location):
    if Candidate.objects.filter(email__iexact=email).exists():
        return None

    # store skills as comma separated string
    skills_value = skills
    if isinstance(skills, list):
        skills_value = ','.join(skills)

    return Candidate.objects.create(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        university=university,
        degree_name=degree_name,
        years_of_experience=years_of_experience,
        skills=skills_value,
        preferred_working_mode=preferred_working_mode,
        preferred_location=preferred_location,
    )

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


@csrf_exempt
@require_POST
def register_account(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    email = payload.get("email")
    password = payload.get("password")
    account_type = payload.get("account_type")

    if not email or not password or not account_type:
        return JsonResponse(
            {"error": "email, password and account_type are required"},
            status=400,
        )

    if account_type not in ["candidate", "company"]:
        return JsonResponse(
            {"error": "account_type must be either candidate or company"},
            status=400,
        )

    try:
        account = _create_account(email, password, account_type)
    except IntegrityError:
        return JsonResponse({"error": "Unable to create account"}, status=409)

    if account is None:
        return JsonResponse({"error": "An account with this email already exists"}, status=409)

    return JsonResponse(
        {
            "message": "Account created successfully",
            "email": account.email,
            "account_type": account.account_type,
        },
        status=201,
    )


@csrf_exempt
@require_POST
def register_company(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    company_name = payload.get("company_name")
    email = payload.get("email")
    company_information = payload.get("company_information")

    if not company_name or not email or not company_information:
        return JsonResponse(
            {"error": "company_name, email and company_information are required"},
            status=400,
        )

    account = Account.objects.filter(email__iexact=email).first()
    if account is None:
        return JsonResponse({"error": "Account not found for this email"}, status=404)

    if account.account_type != "company":
        return JsonResponse({"error": "Account type must be company"}, status=400)


    try:
        company = _create_company_account(email, company_name, company_information)
    except IntegrityError:
        return JsonResponse({"error": "Unable to create company account"}, status=409)

    if company is None:
        return JsonResponse({"error": "A company with this email already exists"}, status=409)

    return JsonResponse(
        {
            "message": "Company account created successfully",
            "email": account.email,
            "account_type": account.account_type,
        },
        status=201,
    )


@csrf_exempt
@require_POST
def register_candidate(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    email = payload.get("email")
    full_name = payload.get("full_name")
    phone_number = payload.get("phone_number")
    university = payload.get("university")
    degree_name = payload.get("degree_name")
    years_of_experience = payload.get("years_of_experience")
    skills = payload.get("skills")
    preferred_working_mode = payload.get("preferred_working_mode")
    preferred_location = payload.get("preferred_location")

    if not email or not full_name or phone_number is None or university is None or degree_name is None or years_of_experience is None or skills is None or preferred_working_mode is None or preferred_location is None:
        return JsonResponse(
            {"error": "email, full_name, phone_number, university, degree_name, years_of_experience, skills, preferred_working_mode and preferred_location are required"},
            status=400,
        )

    account = Account.objects.filter(email__iexact=email).first()
    if account is None:
        return JsonResponse({"error": "Account not found for this email"}, status=404)

    if account.account_type != "candidate":
        return JsonResponse({"error": "Account type must be candidate"}, status=400)

    try:
        candidate = _create_candidate_record(
            email,
            full_name,
            phone_number,
            university,
            degree_name,
            int(years_of_experience),
            skills,
            preferred_working_mode,
            preferred_location,
        )
    except IntegrityError:
        return JsonResponse({"error": "Unable to create candidate record"}, status=409)

    if candidate is None:
        return JsonResponse({"error": "A candidate with this email already exists"}, status=409)

    return JsonResponse(
        {
            "message": "Candidate created successfully",
            "email": account.email,
            "account_type": account.account_type,
        },
        status=201,
    )


@require_GET
def get_company_profile(request, email):
    account = Account.objects.filter(email__iexact=email).first()
    if account is None:
        return JsonResponse({"error": "Account not found"}, status=404)

    company = Company.objects.filter(email__iexact=email).first()
    if company is None:
        return JsonResponse({"error": "Company profile not found"}, status=404)

    return JsonResponse(
        {
            "email": company.email,
            "company_name": company.company_name,
            "company_information": company.company_information,
            "account_type": account.account_type,
        },
        status=200,
    )


@require_GET
def get_candidate_profile(request, email):
    account = Account.objects.filter(email__iexact=email).first()
    if account is None:
        return JsonResponse({"error": "Account not found"}, status=404)

    candidate = Candidate.objects.filter(email__iexact=email).first()
    if candidate is None:
        return JsonResponse({"error": "Candidate profile not found"}, status=404)

    # convert skills stored as comma-separated string into list
    skills_value = candidate.skills or ""
    if isinstance(skills_value, str):
        skills_list = [s for s in skills_value.split(",") if s]
    else:
        skills_list = list(skills_value)

    return JsonResponse(
        {
            "email": candidate.email,
            "full_name": candidate.full_name,
            "phone_number": candidate.phone_number,
            "university": candidate.university,
            "degree_name": candidate.degree_name,
            "years_of_experience": candidate.years_of_experience,
            "skills": skills_list,
            "preferred_working_mode": candidate.preferred_working_mode,
            "preferred_location": candidate.preferred_location,
            "account_type": account.account_type,
        },
        status=200,
    )