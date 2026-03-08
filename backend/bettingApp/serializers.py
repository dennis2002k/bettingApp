from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from .tasks import settle_expired_bets


class UserProfileSerailizer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    bets = serializers.PrimaryKeyRelatedField(many=True, queryset=Bet.objects.all())
    profile = UserProfileSerailizer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'bets', 'profile', 'is_staff')

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class MarketSerializer(serializers.ModelSerializer):
    # event = serializers.ReadOnlyField(source="event.name")
    class Meta:
        model = Market
        fields = "__all__"

    def validate_market(self, market):
        if not market.is_active:
            raise serializers.ValidationError("Market is not active.")
        
        if market.event.start_at <= timezone.now():
            raise serializers.ValidationError("Cannot place a bet after the event has started.")
        
        return market

    def update(self, instance, validated_data):
        old_result = instance.result  # save the old result before updating
        instance = super().update(instance, validated_data)
        
        # only trigger if result changed from None to True/False
        if old_result is None and instance.result is not None:
            settle_expired_bets.delay()
        
        return instance

class EventSerializer(serializers.ModelSerializer):
    markets = MarketSerializer(many=True, read_only=True)
    class Meta:
        model = Event
        fields = "__all__"

class BetSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    market_name = serializers.ReadOnlyField(source="market.name")
    event_name = serializers.ReadOnlyField(source="event.name")
    class Meta:
        model = Bet
        fields = "__all__"

    def validate_amount(self, amount):
        user_profile = self.context['request'].user.profile
        if amount > user_profile.balance:
            raise serializers.ValidationError("Insufficient funds.")
        return amount
    
    def validate_market(self, market): 
        if not market.is_active:
            raise serializers.ValidationError("Market is not active.")
        return market
    
    def create (self, validated_data):
        # get owner of bet
        user = validated_data['user']

        # reduce funds from the user for the bet
        user_profile = user.profile
        user_profile.balance -= validated_data["amount"]
        user_profile.save()
        # set expiration
        market = validated_data['market']
        validated_data['expires_at'] = market.event.ends_at

        
        return Bet.objects.create(**validated_data)
    

