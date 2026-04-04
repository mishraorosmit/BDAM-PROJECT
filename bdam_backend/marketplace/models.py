from django.db import models

# Definition :
class Asset(models.Model):
    wallet_address = models.CharField(max_length=100)
    cid = models.CharField(max_length=255)
    asset_name = models.CharField(max_length=255)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# FOR ADMIN PORTAL : 

def __str__(self):
    return self.asset_name

# Create your models here.
