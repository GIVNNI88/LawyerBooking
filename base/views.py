from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from base.models import Contract, User, Payments
from rest_framework.response import Response

# Create your views here.
@api_view(["GET"])
def getRoutes(request):
    # יוצר כתובות חדשות
    routes = [
        "/base/contracts",
    ]
    return Response(routes)


class Signup(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        user = User.objects.create_user(
            username=username, email=email, password=password)
        user.save()

        return HttpResponse('signed up')


class MarkPaymentAsPaid(APIView):
    def patch(self, request, contract_id, payment_id):
        try:
            payment = Payments.objects.get(id=payment_id, contract_id=contract_id)
            payment.didPayed = True
            payment.save()
            return Response('Payment marked as paid successfully', status=status.HTTP_200_OK)
        except Payments.DoesNotExist:
            return Response('Payment not found', status=status.HTTP_404_NOT_FOUND)

@permission_classes([IsAuthenticated])
class ContractAPI(APIView):
    def get(self, request):
            user = request.user
            contracts = Contract.objects.filter(user=user).prefetch_related('payments_set')
            serialized_contracts = []
            for contract in contracts:
                serialized_contract = {
                    'id': contract.id,
                    'name': contract.name,
                    'amount': contract.amount,
                    "created": contract.created,
                    "customerName": contract.customerName,
                    "phoneNumber": contract.phoneNumber,
                    'payments': list(contract.payments_set.values())
                }
                serialized_contracts.append(serialized_contract)
            return JsonResponse({"contracts": serialized_contracts})
    
    def post(self, request):
        user = request.user
        contract = Contract.objects.create(
            customerName=request.data["customerName"],
            phoneNumber=request.data["phoneNumber"],
            name=request.data['text'],
            amount=request.data['amount'],
            user=user
        )
        payments = request.data['payments']
        for payment in payments:
            contract.payments_set.create(
                
                date=payment['date'],
                amount=payment['amount'],
                name=payment['name']
                
            )
        return HttpResponse('posted')
    
    def delete(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
            contract.delete()
            return HttpResponse('Contract deleted successfully')
        except Contract.DoesNotExist:
            return HttpResponse('Contract not found', status=404)


@permission_classes([IsAuthenticated])
class UserData(APIView):
    def get(self, request):
        user = request.user
        return JsonResponse({'balance': user.balance}, safe=False)

