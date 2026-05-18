import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Candidate, JobPosting
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

def split_skills(skills_text):
    if not skills_text:
        return []

    return [
        skill.strip().lower()
        for skill in skills_text.split(",")
        if skill.strip()
    ]


def recommended_jobs(request):
    candidate_email = request.GET.get("email")

    if not candidate_email:
        return JsonResponse({"error": "Candidate email is required"}, status=400)

    try:
        candidate = Candidate.objects.get(email=candidate_email)
    except Candidate.DoesNotExist:
        return JsonResponse({"error": "Candidate not found"}, status=404)

    candidate_skills = split_skills(candidate.skills)
    jobs = JobPosting.objects.all()

    recommendations = []

    for job in jobs:
        score = 0
        job_skills = split_skills(job.required_skills)

        for skill in candidate_skills:
            if skill in job_skills:
                score += 3

        if candidate.years_of_experience >= job.required_yoe:
            score += 2

        if candidate.preferred_working_mode.lower() == job.work_mode.lower():
            score += 2

        if candidate.preferred_location.lower() == job.location.lower():
            score += 2

        if candidate.degree_name.lower() == job.required_degree.lower():
            score += 1

        recommendations.append({
            "job_title": job.job_title,
            "company_name": job.company_email.company_name,
            "description": job.description,
            "work_mode": job.work_mode,
            "required_yoe": job.required_yoe,
            "required_skills": job.required_skills,
            "required_degree": job.required_degree,
            "location": job.location,
            "score": score,
        })

    recommendations.sort(key=lambda item: item["score"], reverse=True)

    if not candidate.is_member:
        recommendations = recommendations[:10]

    return JsonResponse({"recommended_jobs": recommendations})

def recommended_candidates(request):
    job_id = request.GET.get("job_id")

    if not job_id:
        return JsonResponse(
            {"error": "Job ID is required"},
            status=400
        )

    try:
        job = JobPosting.objects.get(id=job_id)

    except JobPosting.DoesNotExist:
        return JsonResponse(
            {"error": "Job posting not found"},
            status=404
        )

    job_skills = split_skills(job.required_skills)

    candidates = Candidate.objects.all()

    recommendations = []

    for candidate in candidates:

        score = 0

        candidate_skills = split_skills(candidate.skills)

        for skill in candidate_skills:
            if skill in job_skills:
                score += 3

        if candidate.years_of_experience >= job.required_yoe:
            score += 2

        if (
            candidate.preferred_working_mode.lower()
            == job.work_mode.lower()
        ):
            score += 2

        if (
            candidate.preferred_location.lower()
            == job.location.lower()
        ):
            score += 2

        if (
            candidate.degree_name.lower()
            == job.required_degree.lower()
        ):
            score += 1

        recommendations.append({
            "email": candidate.email,
            "full_name": candidate.full_name,
            "skills": candidate.skills,
            "years_of_experience": candidate.years_of_experience,
            "score": score,
        })

    recommendations.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    if not job.company_email.is_member:
        recommendations = recommendations[:10]

    return JsonResponse({
        "recommended_candidates": recommendations
    })