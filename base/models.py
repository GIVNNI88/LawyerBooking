from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.
class User(AbstractUser):
    username = models.CharField(blank=False, max_length=50, unique=True)
    password = models.CharField(blank=False, max_length=50)
    email = models.EmailField(blank=False, null=True, max_length=254)


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "email": self.email,
            "contract": self.contract
        }

class Contract(models.Model):
    name = models.CharField(blank=False, max_length=200)
    amount = models.IntegerField(blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE ,null=True)
    phoneNumber = models.CharField(max_length=200,blank=False,default="")
    created = models.DateTimeField(default=timezone.now)
    firstApt = models.BooleanField(default=True)
    customerName = models.CharField(max_length=200,blank=False,default="")
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "phoneNumber":self.phoneNumber,
            "amount": self.amount,
            "created": self.created.strftime("%Y-%m-%d %H:%M:%S"),
            "firstApt": self.firstApt,
            "customerName":self.customerName
        }
        
class Reminders(models.Model):   
    name = models.CharField(blank=False, max_length=200)
    date = models.DateTimeField(default=timezone.now)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE ,null=True) 
            
    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
            "date": self.date,
        }
        
class Payments(models.Model):
    name = models.CharField(blank=False, max_length=200,default="")
    date = models.DateTimeField(default=timezone.now)
    amount = models.IntegerField(blank=False)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE ,null=True) 
    didPayed = models.BooleanField(default=False)
    
    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
            "date": self.date,
            "amount": self.amount,
            "didPayed": self.didPayed
    
        }
        