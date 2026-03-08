from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_list_or_404
from .models import *
from .serializers import *
from rest_framework.exceptions import  PermissionDenied
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from decimal import Decimal


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='add-funds')
    def add_funds(self, request):
        amount = request.data.get('amount')

        if not amount or float(amount) <= 0:
            return Response(
                {'error': 'Invalid amount.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = request.user.profile
        profile.balance += Decimal(str(amount))
        profile.save()

        return Response({'balance': profile.balance}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CreateEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]


class EventReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


class MarketViewSet(viewsets.ModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer

    def get_permissions(self):
        if self.action == "list":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    authentication_classes = [JWTAuthentication]


class BetViewSet(viewsets.ModelViewSet):
    serializer_class = BetSerializer

    def get_queryset(self):
        return Bet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)
    
    permissions = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]



