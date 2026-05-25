from django.db import models


class Account(models.Model):
    email = models.EmailField(primary_key=True)
    password = models.CharField(max_length=128)
    account_type = models.CharField(max_length=50)

    class Meta:
        db_table = 'Account'

    def __str__(self):
        return self.email


class Candidate(models.Model):
    email = models.EmailField(primary_key=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    university = models.CharField(max_length=255)
    degree_name = models.CharField(max_length=255)
    years_of_experience = models.IntegerField()
    skills = models.TextField()
    preferred_working_mode = models.CharField(max_length=100)
    preferred_location = models.CharField(max_length=255)
    is_member = models.BooleanField(default=False)

    class Meta:
        db_table = 'Candidate'

    def __str__(self):
        return self.email


class Company(models.Model):
    email = models.EmailField(primary_key=True)
    company_name = models.CharField(max_length=255)
    company_information = models.TextField()
    contact_information = models.CharField(max_length=255)
    is_member = models.BooleanField(default=False)

    class Meta:
        db_table = 'Company'

    def __str__(self):
        return self.email


class JobPosting(models.Model):
    company_email = models.ForeignKey(Company, on_delete=models.CASCADE, to_field='email', db_index=True)
    job_title = models.CharField(max_length=255)
    description = models.TextField()
    work_mode = models.CharField(max_length=100)
    required_yoe = models.IntegerField()
    required_skills = models.TextField()
    required_degree = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    class Meta:
        db_table = 'JobPosting'

    def __str__(self):
        return f"{self.job_title} - {self.company_email}"