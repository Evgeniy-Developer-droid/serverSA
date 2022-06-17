from .models import Event, EventMedia
from rest_framework import serializers
from datetime import datetime


class EventMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventMedia
        fields = '__all__'
        extra_kwargs = {'event': {'write_only': True}}


class EventSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()
    meta = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField(read_only=True)
    desc_short = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%d/%m/%Y %H:%M")

    def get_desc_short(self, obj):
        return obj.description[:20]+'...' if obj.description else "..."

    def get_media(self, obj):
        instance = EventMedia.objects.filter(event=obj.pk, extension='image').first()
        if instance:
            return EventMediaSerializer(instance).data
        return {}


    def get_meta(self, obj):
        return {
            'image': EventMedia.objects.filter(event=obj.pk, extension='image').count(),
            'video': EventMedia.objects.filter(event=obj.pk, extension='video').count()
        }

    def create(self, validated_data):
        event = Event(**validated_data)
        event.save()
        print(self.initial_data)
        if 'media_ids' in self.initial_data:
            media = EventMedia.objects.filter(pk__in=self.initial_data['media_ids'])
            media.update(event=event)
        return event
