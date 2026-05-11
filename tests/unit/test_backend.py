import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

import django
from django.test import Client, SimpleTestCase

django.setup()


class BackendHealthTest(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        response = Client().get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"status": "ok"})