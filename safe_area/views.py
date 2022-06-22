import random
import requests

from django.shortcuts import render
from django.http import HttpResponse
from .models import AboutPage, Event
from django.utils.translation import gettext_lazy as _


def index(request):
	return render(request, 'safe_area/index.html', {})


def about(request):
	content = _("""Welcome to our website!
	The site is intended for everyone who cares about their safety. On the site you can get acquainted with an interactive map that displays recent events and the situation around you. You can also create an event and thereby warn others about a danger or inform about a situation. All events you create are completely anonymous.
	For any questions, you can contact me using the Linkedin social network, Gmail or using the contact form on the site.
	Thank you for your visit! Take care of yourself!""")
	return render(request, 'safe_area/about.html', {'content': content})


def contact_us(request):
	return render(request, 'safe_area/contact_us.html', {})


# def create_random_events(request, number):
# 	Event.objects.all().delete()
# 	# types = ('murder', 'accident', 'fight', 'theft', 'shooting', 'other',)
# 	# for i in range(number):
# 	# 	Event.objects.create(
# 	# 		type_of_situation=random.choice(types),
# 	# 		description="Bacon ipsum dolor amet pig chuck alcatra beef short loin beef",
# 	# 		lat=random.uniform(-80, 80),
# 	# 		lon=random.uniform(-170, 170)
# 	# 	)
# 	return HttpResponse("OK")