import random
import requests

from django.shortcuts import render
from django.http import HttpResponse
from .models import AboutPage, Event


def index(request):
	return render(request, 'safe_area/index.html', {})


def about(request):
	instance = AboutPage.objects.all().first()
	return render(request, 'safe_area/about.html', {'content':instance})


def contact_us(request):
	return render(request, 'safe_area/contact_us.html', {})


def create_random_events(request, number):
	types = ('murder', 'accident', 'fight', 'theft', 'shooting', 'other',)
	for i in range(number):
		req = requests.get('https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=1')
		Event.objects.create(
			type_of_situation=random.choice(types),
			description=req.json()[-1],
			lat=random.uniform(40, 70),
			lon=random.uniform(10, 50)
		)
	return HttpResponse("OK")