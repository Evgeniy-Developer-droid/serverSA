from django.contrib import admin
from .models import Event, EventMedia


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('lat', 'lon', 'description', 'timestamp',)


@admin.register(EventMedia)
class EventMediaAdmin(admin.ModelAdmin):
    list_display = ('extension', 'timestamp',)