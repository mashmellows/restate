from django.db import models

# Create your models here.

class Home(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=10)
    name = models.CharField(max_length=45)
    address = models.CharField(max_length=70)
    description = models.TextField(blank=True, null=True)
    rooms = models.IntegerField()
    bathrooms = models.IntegerField()
    propertyType = models.CharField(max_length=25)
    latitude = models.DecimalField(blank=True, null=True, max_digits=19, decimal_places=15)
    longitude = models.DecimalField(blank=True, null=True, max_digits=19, decimal_places=15)
    picture = models.URLField(blank=True)
    agencyId = models.IntegerField()
    price = models.CharField(max_length=45)

class Agent(models.Model):
    id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=45)
    lastName = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    phoneNumber = models.IntegerField()
    agency = models.CharField(max_length=45)
    picture = models.URLField(blank=True)
    age = models.CharField(max_length=45)

class Agency(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    phoneNumber = models.IntegerField()
    logo = models.URLField(blank=True)
