import json

from django.http import JsonResponse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.db.models import Q
from rapidfuzz import fuzz

from .models import Candidate, JobPosting
from .models import Account
from .models import Account, Company, Candidate, JobPosting



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
@require_GET
def search_candidates(request):
    try:
        search_string = request.GET.get("search", "").strip()
        experience_param = request.GET.get("experience", "")
        skills_param = request.GET.get("skills", "")
        degree_param = request.GET.get("degree", "").strip()

        experience_indices = [int(x.strip()) for x in experience_param.split(",") if x.strip().isdigit()]
        skills = [x.strip() for x in skills_param.split(",") if x.strip()]
        
        candidates = Candidate.objects.all()
        
        if experience_indices:
            experience_q = Q()
            for exp_idx in experience_indices:
                if exp_idx == 0:
                    experience_q |= Q(years_of_experience=0)
                elif exp_idx == 1:
                    experience_q |= Q(years_of_experience__gte=1, years_of_experience__lte=4)
                elif exp_idx == 2:
                    experience_q |= Q(years_of_experience__gte=4, years_of_experience__lte=7)
                elif exp_idx == 3:
                    experience_q |= Q(years_of_experience__gte=8)
            candidates = candidates.filter(experience_q)
        
        if degree_param:
            candidates = candidates.filter(degree_name__icontains=degree_param)
        
        if skills:
            for skill in skills:
                candidates = candidates.filter(skills__icontains=skill)
        
        results = []
        for candidate in candidates:
            skills_list = [s.strip() for s in (candidate.skills or "").split(",") if s.strip()]
            
            results.append({
                "email": candidate.email,
                "name": candidate.full_name,
                "phone": candidate.phone_number,
                "prefferedWorkingMode": candidate.preferred_working_mode,
                "location": candidate.preferred_location,
                "yoe": candidate.years_of_experience,
                "skills": skills_list,
                "degree": candidate.degree_name,
                "university": candidate.university,
            })
        
        if search_string:
            FUZZY_THRESHOLD = 70
            
            # add more synonyms later
            SYNONYM_GROUPS = [
                [
                    "mei ling ng", 
                    "meiling ng", 
                    "may ling ng", 
                    "mayling ng", 
                    "ng mei ling", 
                    "ng meiling", 
                    "ms mei ling ng",
                    "mrs mei ling ng"
                ],
                [
                    "rafael costa", 
                    "raphael costa", 
                    "rafael da costa", 
                    "raphael da costa", 
                    "mr rafael costa", 
                    "mr raphael costa",
                    "rafaelcosta"
                ],
                [
                    "ava tan", 
                    "ava t.", 
                    "ava t. tan", 
                    "ms ava tan", 
                    "miss ava tan", 
                    "tan ava", 
                    "avatan"
                ]
            ]
            
            search_lower = search_string.lower()
            search_terms = [search_lower]
            for group in SYNONYM_GROUPS:
                for term in group:
                    if fuzz.ratio(search_lower, term) > 80: 
                        search_terms.extend(group)
                        break
            
            search_terms = list(set(search_terms))
            
            results_with_scores = []
            
            for result in results:
                name_lower = result["name"].lower()
                
                best_score_for_job = 0
                
                for term in search_terms:
                    name_scores = [
                        fuzz.ratio(term, name_lower),
                        fuzz.partial_ratio(term, name_lower),
                        fuzz.token_sort_ratio(term, name_lower),
                        fuzz.token_set_ratio(term, name_lower),
                    ]
                    
                    max_term_score = max(name_scores)
                    if max_term_score > best_score_for_job:
                        best_score_for_job = max_term_score
                
                if best_score_for_job >= FUZZY_THRESHOLD:
                    results_with_scores.append((result, best_score_for_job))
            
            results_with_scores.sort(key=lambda x: x[1], reverse=True)
            results = [result for result, score in results_with_scores]
        
        return JsonResponse({
            "candidates": results,
            "count": len(results),
        }, status=200)
        
    except ValueError as e:
        return JsonResponse({"error": "Invalid filter parameters"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_GET
def search_jobs(request):
    try:
        search_string = request.GET.get("search", "").strip()
        experience_param = request.GET.get("experience", "")
        work_mode_param = request.GET.get("workMode", "")
        skills_param = request.GET.get("skills", "")
        location_param = request.GET.get("location", "").strip()

        experience_indices = [int(x.strip()) for x in experience_param.split(",") if x.strip().isdigit()]
        work_modes = [x.strip() for x in work_mode_param.split(",") if x.strip()]
        required_skills = [x.strip() for x in skills_param.split(",") if x.strip()]
        
        jobs = JobPosting.objects.all()
        
        if experience_indices:
            experience_q = Q()
            for exp_idx in experience_indices:
                if exp_idx == 0:
                    experience_q |= Q(required_yoe=0)
                elif exp_idx == 1:
                    experience_q |= Q(required_yoe__gte=1, required_yoe__lte=4)
                elif exp_idx == 2:
                    experience_q |= Q(required_yoe__gte=4, required_yoe__lte=7)
                elif exp_idx == 3:
                    experience_q |= Q(required_yoe__gte=8)
            jobs = jobs.filter(experience_q)
        
        if work_modes:
            work_mode_q = Q()
            for mode in work_modes:
                work_mode_q |= Q(work_mode__iexact=mode)
            jobs = jobs.filter(work_mode_q)
        
        if location_param:
            jobs = jobs.filter(location__icontains=location_param)
        
        if required_skills:
            for skill in required_skills:
                jobs = jobs.filter(required_skills__icontains=skill)
        
        results = []
        for job in jobs:
            skills_list = [s.strip() for s in (job.required_skills or "").split(",") if s.strip()]
            
            results.append({
                "id": job.id,
                "title": job.job_title,
                "company": job.company_email.company_name,
                "description": job.description,
                "workMode": job.work_mode,
                "location": job.location,
                "contactEmail": job.company_email.email,
                "yoe": job.required_yoe,
                "skills": skills_list,
                "degree": job.required_degree,
            })
        
        if search_string:
            FUZZY_THRESHOLD = 70
            
            # add more synonyms later
            SYNONYM_GROUPS = [
                ["software engineer", "programmer", "coder", "developer", "swe", "software developer"],
                ["frontend", "front-end", "ui", "user interface", "react developer"],
                ["backend", "back-end", "server-side", "api developer"],
                ["data scientist", "machine learning engineer", "ml engineer", "data analyst"],
            ]
            
            search_lower = search_string.lower()
            search_terms = [search_lower]
            for group in SYNONYM_GROUPS:
                for term in group:
                    if fuzz.ratio(search_lower, term) > 80: 
                        search_terms.extend(group)
                        break
            
            search_terms = list(set(search_terms))
            
            results_with_scores = []
            
            for result in results:
                title_lower = result["title"].lower()
                desc_lower = result["description"].lower()
                
                best_score_for_job = 0
                
                for term in search_terms:
                    title_scores = [
                        fuzz.ratio(term, title_lower),
                        fuzz.partial_ratio(term, title_lower),
                        fuzz.token_sort_ratio(term, title_lower),
                        fuzz.token_set_ratio(term, title_lower),
                    ]
                    
                    desc_scores = [
                        fuzz.ratio(term, desc_lower),
                        fuzz.partial_ratio(term, desc_lower),
                        fuzz.token_sort_ratio(term, desc_lower),
                        fuzz.token_set_ratio(term, desc_lower),
                    ]
                    
                    max_term_score = max(max(title_scores), max(desc_scores))
                    if max_term_score > best_score_for_job:
                        best_score_for_job = max_term_score
                
                if best_score_for_job >= FUZZY_THRESHOLD:
                    results_with_scores.append((result, best_score_for_job))
            
            results_with_scores.sort(key=lambda x: x[1], reverse=True)
            results = [result for result, score in results_with_scores]
        
        return JsonResponse({
            "jobs": results,
            "count": len(results),
        }, status=200)
        
    except ValueError as e:
        return JsonResponse({"error": "Invalid filter parameters"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


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
