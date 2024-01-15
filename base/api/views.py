from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def getRoutes(request):
    # יוצר כתובות חדשות
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)
