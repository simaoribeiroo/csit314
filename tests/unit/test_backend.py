import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

import django
from django.test import Client, SimpleTestCase, TestCase

django.setup()

from database.models import Account, Company, Candidate


class BackendHealthTest(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        response = Client().get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"status": "ok"})


class BackendLoginTest(TestCase):
    fixtures = ["dummy_data.json"]

    def test_login_success(self):
        response = Client().post(
            "/api/login/",
            data={"email": "candidate1@example.com", "password": "candidatepass123"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "message": "Login successful",
                "email": "candidate1@example.com",
                "account_type": "candidate",
            },
        )

    def test_login_invalid_password(self):
        response = Client().post(
            "/api/login/",
            data={"email": "candidate1@example.com", "password": "wrongpass"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(response.content, {"error": "Invalid password"})

    def test_login_account_not_found(self):
        response = Client().post(
            "/api/login/",
            data={"email": "missing@example.com", "password": "whatever"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Account not found"})

    def test_login_missing_fields(self):
        response = Client().post(
            "/api/login/",
            data={"email": "candidate1@example.com"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Both email and password are required"})

    def test_login_get_method_not_allowed(self):
        response = Client().get("/api/login/")

        self.assertEqual(response.status_code, 405)

    def test_login_invalid_json_payload(self):
        response = Client().post(
            "/api/login/",
            data="{not-valid-json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid JSON payload"})


class BackendRegisterAccountTest(TestCase):
    fixtures = ["dummy_data.json"]

    def test_register_account_success(self):
        response = Client().post(
            "/api/register-account/",
            data={
                "email": "new-company@example.com",
                "password": "securepass123",
                "account_type": "company",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertJSONEqual(
            response.content,
            {
                "message": "Account created successfully",
                "email": "new-company@example.com",
                "account_type": "company",
            },
        )
        self.assertTrue(Account.objects.filter(email="new-company@example.com").exists())

    def test_register_account_duplicate_email(self):
        response = Client().post(
            "/api/register-account/",
            data={
                "email": "candidate1@example.com",
                "password": "securepass123",
                "account_type": "company",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)
        self.assertJSONEqual(response.content, {"error": "An account with this email already exists"})

    def test_register_account_invalid_account_type(self):
        response = Client().post(
            "/api/register-account/",
            data={
                "email": "new-user@example.com",
                "password": "securepass123",
                "account_type": "admin",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "account_type must be either candidate or company"})

    def test_register_account_missing_fields(self):
        response = Client().post(
            "/api/register-account/",
            data={"email": "missing@example.com"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "email, password and account_type are required"})

    def test_register_account_get_method_not_allowed(self):
        response = Client().get("/api/register-account/")

        self.assertEqual(response.status_code, 405)


class BackendRegisterCompanyTest(TestCase):
    fixtures = ["dummy_data.json"]

    def test_register_company_success_creates_account_and_company(self):
        Account.objects.create(
            email="acme@example.com",
            password="securepass123",
            account_type="company",
        )

        response = Client().post(
            "/api/register-company/",
            data={
                "company_name": "Acme Corp",
                "email": "acme@example.com",
                "company_information": "We build software.",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertJSONEqual(
            response.content,
            {
                "message": "Company account created successfully",
                "email": "acme@example.com",
                "account_type": "company",
            },
        )

        account = Account.objects.get(email="acme@example.com")
        company = Company.objects.get(email="acme@example.com")

        self.assertEqual(account.account_type, "company")
        self.assertEqual(account.password, "securepass123")
        self.assertEqual(company.company_name, "Acme Corp")
        self.assertEqual(company.company_information, "We build software.")

    def test_register_company_duplicate_email(self):
        Account.objects.create(
            email="companyx@example.com",
            password="securepass123",
            account_type="company",
        )
        Company.objects.create(
            email="companyx@example.com",
            company_name="Company X",
            company_information="Existing company",
        )

        response = Client().post(
            "/api/register-company/",
            data={
                "company_name": "Duplicate Inc",
                "email": "companyx@example.com",
                "company_information": "Duplicate account test.",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)
        self.assertJSONEqual(response.content, {"error": "A company with this email already exists"})

    def test_register_company_account_not_found(self):
        response = Client().post(
            "/api/register-company/",
            data={
                "company_name": "No Account Inc",
                "email": "missing@example.com",
                "company_information": "No account exists for this email.",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Account not found for this email"})

    def test_register_company_wrong_account_type(self):
        response = Client().post(
            "/api/register-company/",
            data={
                "company_name": "Wrong Type Inc",
                "email": "candidate1@example.com",
                "company_information": "Account exists but is not company type.",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Account type must be company"})

    def test_register_company_missing_fields(self):
        response = Client().post(
            "/api/register-company/",
            data={
                "company_name": "Missing Fields Inc",
                "email": "missing@example.com",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"error": "company_name, email and company_information are required"},
        )

    def test_register_company_get_method_not_allowed(self):
        response = Client().get("/api/register-company/")

        self.assertEqual(response.status_code, 405)

    def test_register_company_invalid_json_payload(self):
        response = Client().post(
            "/api/register-company/",
            data="{not-valid-json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid JSON payload"})


class BackendRegisterCandidateTest(TestCase):
    fixtures = ["dummy_data.json"]

    def test_register_candidate_success_creates_account_and_candidate(self):
        Account.objects.create(
            email="candnew@example.com",
            password="securepass123",
            account_type="candidate",
        )

        response = Client().post(
            "/api/register-candidate/",
            data={
                "email": "candnew@example.com",
                "full_name": "New Candidate",
                "phone_number": "+6512345678",
                "university": "NUS",
                "degree_name": "CS",
                "years_of_experience": 2,
                "skills": "Python,React",
                "preferred_working_mode": "Remote",
                "preferred_location": "Singapore",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertJSONEqual(
            response.content,
            {
                "message": "Candidate created successfully",
                "email": "candnew@example.com",
                "account_type": "candidate",
            },
        )

        candidate = Candidate.objects.get(email="candnew@example.com")
        self.assertEqual(candidate.full_name, "New Candidate")
        self.assertEqual(candidate.university, "NUS")

    def test_register_candidate_duplicate_email(self):
        Account.objects.create(
            email="canddup@example.com",
            password="securepass123",
            account_type="candidate",
        )
        Candidate.objects.create(
            email="canddup@example.com",
            full_name="Existing",
            phone_number="+6511111111",
            university="NUS",
            degree_name="CS",
            years_of_experience=1,
            skills="Python",
            preferred_working_mode="Remote",
            preferred_location="Singapore",
        )

        response = Client().post(
            "/api/register-candidate/",
            data={
                "email": "canddup@example.com",
                "full_name": "Duplicate",
                "phone_number": "+6512345678",
                "university": "NUS",
                "degree_name": "CS",
                "years_of_experience": 2,
                "skills": "Python",
                "preferred_working_mode": "Remote",
                "preferred_location": "Singapore",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)
        self.assertJSONEqual(response.content, {"error": "A candidate with this email already exists"})

    def test_register_candidate_account_not_found(self):
        response = Client().post(
            "/api/register-candidate/",
            data={
                "email": "missing@example.com",
                "full_name": "No Account",
                "phone_number": "+6512345678",
                "university": "NUS",
                "degree_name": "CS",
                "years_of_experience": 0,
                "skills": "",
                "preferred_working_mode": "Remote",
                "preferred_location": "Singapore",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Account not found for this email"})

    def test_register_candidate_wrong_account_type(self):
        Account.objects.create(
            email="wrongtype-company@example.com",
            password="companypass123",
            account_type="company",
        )

        response = Client().post(
            "/api/register-candidate/",
            data={
                "email": "wrongtype-company@example.com",
                "full_name": "Wrong Type",
                "phone_number": "+6512345678",
                "university": "NUS",
                "degree_name": "CS",
                "years_of_experience": 0,
                "skills": "",
                "preferred_working_mode": "Remote",
                "preferred_location": "Singapore",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Account type must be candidate"})

    def test_register_candidate_missing_fields(self):
        response = Client().post(
            "/api/register-candidate/",
            data={
                "email": "missing@example.com",
                "full_name": "Missing Fields",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)

    def test_register_candidate_get_method_not_allowed(self):
        response = Client().get("/api/register-candidate/")

        self.assertEqual(response.status_code, 405)

    def test_register_candidate_invalid_json_payload(self):
        response = Client().post(
            "/api/register-candidate/",
            data="{not-valid-json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid JSON payload"})


class BackendProfileTest(TestCase):
    fixtures = ["dummy_data.json"]

    def test_get_company_profile_success(self):
        response = Client().get("/api/company/company1@example.com/")

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "email": "company1@example.com",
                "company_name": "TechCorp",
                "company_information": "A product-focused software company building internal tools and customer-facing platforms.",
                "account_type": "company",
            },
        )

    def test_get_company_profile_account_not_found(self):
        response = Client().get("/api/company/missing@example.com/")

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Account not found"})

    def test_get_company_profile_missing_profile(self):
        Account.objects.create(
            email="no_profile@example.com",
            password="x",
            account_type="company",
        )
        response = Client().get("/api/company/no_profile@example.com/")

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Company profile not found"})

    def test_get_candidate_profile_success(self):
        response = Client().get("/api/candidate/candidate1@example.com/")

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "email": "candidate1@example.com",
                "full_name": "Ava Tan",
                "phone_number": "+65 9123 4567",
                "university": "National University of Singapore",
                "degree_name": "Computer Science",
                "years_of_experience": 2,
                "skills": ["Python", "Django", "SQL", "Git"],
                "preferred_working_mode": "Hybrid",
                "preferred_location": "Singapore",
                "account_type": "candidate",
            },
        )

    def test_get_candidate_profile_account_not_found(self):
        response = Client().get("/api/candidate/missing@example.com/")

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Account not found"})

    def test_get_candidate_profile_missing_profile(self):
        Account.objects.create(
            email="no_cand_profile@example.com",
            password="x",
            account_type="candidate",
        )
        response = Client().get("/api/candidate/no_cand_profile@example.com/")

        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {"error": "Candidate profile not found"})
    
    def test_search_jobs_with_filters(self):
        response = Client().get("/api/jobs/search/?search=coder&experience=1&workMode=Hybrid&skills=React%2CC%2B%2B&location=Sydney")
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"jobs": [],"count":0})
    
    def test_search_candidates_with_filters(self):
        response = Client().get("/api/candidates/search/?search=ava&experience=1&degree=Computer+Science")
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            "candidates": [
                {
                    "email": "candidate1@example.com",
                    "name": "Ava Tan",
                    "phone": "+65 9123 4567",
                    "prefferedWorkingMode": "Hybrid",
                    "location": "Singapore",
                    "yoe": 2,
                    "skills": [
                        "Python",
                        "Django",
                        "SQL",
                        "Git"
                    ],
                    "degree": "Computer Science",
                    "university": "National University of Singapore"
                }
            ],
            "count": 1
        })
    
    def test_fuzzy_search_jobs(self):
        response = Client().get("/api/jobs/search/?search=coder")
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            "jobs": [
                {
                    "id": 1,
                    "title": "Junior Backend Developer",
                    "company": "TechCorp",
                    "description": "Build and maintain REST APIs, work with relational databases, and support deployment pipelines.",
                    "workMode": "Hybrid",
                    "location": "Singapore",
                    "contactEmail": "company1@example.com",
                    "yoe": 1,
                    "skills": [
                        "Python",
                        "Django",
                        "PostgreSQL",
                        "REST"
                    ],
                    "degree": "Computer Science"
                },
                {
                    "id": 2,
                    "title": "Frontend Engineer",
                    "company": "TechCorp",
                    "description": "Develop responsive interfaces, collaborate with designers, and maintain reusable components.",
                    "workMode": "Remote",
                    "location": "Singapore",
                    "contactEmail": "company1@example.com",
                    "yoe": 2,
                    "skills": [
                        "JavaScript",
                        "React",
                        "CSS",
                        "TypeScript"
                    ],
                    "degree": "Information Systems"
                },
                {
                    "id": 3,
                    "title": "Data Engineer",
                    "company": "GreenWave Solutions",
                    "description": "Design data pipelines, optimize warehouse models, and support analytics workflows.",
                    "workMode": "On-site",
                    "location": "Singapore",
                    "contactEmail": "company2@example.com",
                    "yoe": 3,
                    "skills": [
                        "SQL",
                        "Python",
                        "Airflow",
                        "ETL"
                    ],
                    "degree": "Software Engineering"
                }
            ],
            "count": 3
        })
    
    def test_fuzzy_search_candidates(self):
        response = Client().get("/api/candidates/search/?search=rfel")
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            "candidates": [
                {
                    "email": "candidate2@example.com",
                    "name": "Rafael Costa",
                    "phone": "+65 9888 1122",
                    "prefferedWorkingMode": "Remote",
                    "location": "Singapore",
                    "yoe": 4,
                    "skills": [
                        "JavaScript",
                        "React",
                        "Node.js",
                        "PostgreSQL"
                    ],
                    "degree": "Information Systems",
                    "university": "Singapore Management University"
                }
            ],
            "count": 1
        })
        