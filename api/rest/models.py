from django.db import models

# Create your models here.

class Home(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=10)
    name = models.CharField(max_length=45)
    description = models.TextField(blank=True, null=True)
    rooms = models.IntegerField()
    bathrooms = models.IntegerField()
    property_type = models.CharField(max_length=25)
    latitude = models.DecimalField(blank=True, null=True, max_digits=19, decimal_places=15)
    longitude = models.DecimalField(blank=True, null=True, max_digits=19, decimal_places=15)
    picture = models.URLField(blank=True)
    company_id = models.IntegerField()
    price = models.CharField(max_length=45)

class Agent(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    phone_number = models.IntegerField()
    agency = models.CharField(max_length=45)
    picture = models.URLField(blank=True)
    company_id = models.IntegerField()

class Company(models.Model):
    id = models.AutoField(primary_key=True)
    company_id = models.IntegerField()
    name = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    phone_number = models.IntegerField()
    logo = models.URLField(blank=True)
