from celery import shared_task
from django.utils import timezone
from .models import Bet

@shared_task
def settle_expired_bets():
    expired_bets = Bet.objects.filter(
        expires_at__lt=timezone.now(),
        settled=False
        market__result__isnull=False
    ).select_related('market', 'user__profile')

    print(expired_bets)
    for bet in expired_bets:
        bet.settled = True
        # add your settling logic here, e.g. pay out if market result is True
        if bet.market.result:
            bet.status = Bet.Status.WON
            bet.user.profile.balance += bet.potential_payout
            bet.user.profile.save()
        else:
            bet.status = Bet.Status.LOST
        bet.save()