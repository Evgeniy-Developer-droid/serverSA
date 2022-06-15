from django.shortcuts import render


def index(request):
	return render(request, 'safe_area/index.html', {})
