from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes),
    path('contracts/', views.ContractAPI.as_view(), name='contracts'),
    path('signup/', views.Signup.as_view(), name='signup'),
    path('contracts/<int:contract_id>/', views.ContractAPI.as_view(), name='delete_contract'),
    path('userdata/', views.UserData.as_view(), name='userdata'),
    path('contracts/<int:contract_id>/payments/<int:payment_id>/mark_as_paid/',
        views.MarkPaymentAsPaid.as_view(),
        name='mark_payment_as_paid'),
    
]