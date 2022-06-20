from django.contrib import admin
from .models import Event, EventMedia, AboutPage, Feedback


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('lat', 'lon', 'description', 'timestamp',)


@admin.register(EventMedia)
class EventMediaAdmin(admin.ModelAdmin):
    list_display = ('extension', 'timestamp',)


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        retVal = super().has_add_permission(request)
        if retVal and AboutPage.objects.exists():
            retVal = False
        return retVal


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'text',)
