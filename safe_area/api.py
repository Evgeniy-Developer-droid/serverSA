from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from .serializers import EventSerializer, EventMediaSerializer
from .models import Event, EventMedia


class GetEvents(ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def list(self, request):
        events = Event.objects.all()
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data)


class PostEvent(CreateAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class PostEventMedia(CreateAPIView):
    serializer_class = EventMediaSerializer
    queryset = EventMedia.objects.all()


class DeleteEventMedia(DestroyAPIView):
    serializer_class = EventMediaSerializer
    queryset = EventMedia.objects.all()
