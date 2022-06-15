from django.db import models
from django.utils import timezone


class Event(models.Model):
    timestamp = models.DateTimeField(default=timezone.now)
    lat = models.FloatField(default=0)
    lon = models.FloatField(default=0)
    description = models.TextField(null=True, blank=True)


class EventMedia(models.Model):
    EXTENSION = (
        ('video', 'Video',),
        ('image', 'Image',),
    )
    timestamp = models.DateTimeField(default=timezone.now)
    file = models.FileField(upload_to='events')
    extension = models.CharField(max_length=10, choices=EXTENSION, default='image')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
