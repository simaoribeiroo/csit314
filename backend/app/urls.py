"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.views.static import serve
from django.http import JsonResponse
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.conf import settings

from database.views import (
    login,
    register_account,
    register_company,
    register_candidate,
    get_company_profile,
    get_candidate_profile,
    search_jobs,
)

def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/login/", login),
    path("api/register-account/", register_account),
    path("api/register-company/", register_company),
    path("api/register-candidate/", register_candidate),
    path("api/company/<str:email>/", get_company_profile),
    path("api/candidate/<str:email>/", get_candidate_profile),
    path("api/jobs/search/", search_jobs),
]

# Serve static files (both development and production)
urlpatterns += [
    re_path(r"^static/(?P<path>.*)$", serve, kwargs={"document_root": settings.STATIC_ROOT}),
    re_path(r"^assets/(?P<path>.*)$", serve, kwargs={"document_root": settings.STATIC_ROOT / "assets"}),
]

# SPA catch-all routes - must be last
urlpatterns += [
    path("", TemplateView.as_view(template_name="index.html")),
    re_path(r"^(?!api|static|assets)", TemplateView.as_view(template_name="index.html")),
]
