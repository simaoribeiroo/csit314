import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

import django
from django.test import Client, SimpleTestCase, TestCase

django.setup()


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