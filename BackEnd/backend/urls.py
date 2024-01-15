
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # שולח את המשתמש לכתובות בתיקייה שהגדרנו
    path('api/', include('base.api.urls')),
    path('base/', include('base.urls')),
]
