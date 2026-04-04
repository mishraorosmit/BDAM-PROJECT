from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Asset
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Asset


# GET ALL ASSETS
@api_view(["GET"])
def get_assets(request):
    assets = Asset.objects.all().values()
    return Response(list(assets))


# CREATE NEW ASSET
@api_view(["POST"])
def create_asset(request):
    data = request.data

    asset = Asset.objects.create(
        wallet_address=data.get("wallet_address"),
        cid=data.get("cid"),
        asset_name=data.get("asset_name"),
        description=data.get("description"),
    )

    return Response({
        "message": "Asset Created Successfully!",
        "id": asset.id
    })