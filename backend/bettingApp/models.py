from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
# from django.db.modles import Prefetch
from django.utils import timezone
from datetime import timedelta

def default_start():
    return timezone.now() + timedelta(hours=1)

def default_expiry():
    return timezone.now() + timedelta(hours=5)

class Event(models.Model):
    name = models.TextField(max_length=100)
    starts_at = models.DateTimeField(default=default_start)
    ends_at = models.DateTimeField(default=default_expiry)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}"

class Market(models.Model):
    name = models.TextField(max_length=100)
    current_odds = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='markets')
    result = models.BooleanField(null=True, default=None)

    def __str__(self):
        return f"{self.name}"

class Bet(models.Model):

    class Status(models.TextChoices):
        PENDING = 'P', 'Pending'
        WON = 'W', 'Won'
        LOST = 'L', 'Lost'
        CANCELLED = 'C', 'Cancelled'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bets')
    
    event = models.ForeignKey(Event, on_delete=models.PROTECT, default=None)
    market = models.ForeignKey(Market, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    odds = models.DecimalField(max_digits=6, decimal_places=2)
    potential_payout = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    settled = models.BooleanField(default=False)

    status = models.CharField(
        max_length=1,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.potential_payout = self.amount * self.odds
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.user.username} - {self.amount} @ {self.odds}"
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_bets = models.IntegerField(default=0)
    bets_won = models.IntegerField(default=0)
    bets_lost = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"