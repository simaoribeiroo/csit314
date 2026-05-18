from django.contrib import admin

from .models import (
    Account,
    Candidate,
    Company,
    JobPosting,
)

admin.site.register(Account)
admin.site.register(Candidate)
admin.site.register(Company)
admin.site.register(JobPosting)