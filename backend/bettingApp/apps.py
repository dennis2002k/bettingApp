from django.apps import AppConfig


class BettingappConfig(AppConfig):
    name = 'bettingApp'

    def ready(self):
        import bettingApp.signals
