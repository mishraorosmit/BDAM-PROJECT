from django.urls import path
from .views import *

urlpatterns = [
    path("assets/", get_assets),
    path("assets/create/", create_asset),
]