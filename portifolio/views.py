from django.shortcuts import render
from django.conf import settings

def home(request):
    weather_api_key = settings.WEATHER_API_KEY
    return render(request, 'base.html', {'WEATHER_API_KEY': weather_api_key})
