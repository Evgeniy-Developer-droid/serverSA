from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveAPIView
from .serializers import EventSerializer, EventMediaSerializer, SingleEventSerializer
from .models import Event, EventMedia
from math import pi, cos


class GetEvent(RetrieveAPIView):
    serializer_class = SingleEventSerializer
    queryset = Event.objects.all()


class GetEvents(ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def get_distance(self, zoom, lat):
        return format(156543.03392 * cos(lat * pi / 180) / 2**zoom, '.4f')

    def list(self, request):
        lat = request.GET.get('lat', 0)
        lon = request.GET.get('lon', 0)
        zoom = request.GET.get('zoom', 0)
        distance = self.get_distance(int(zoom), float(lat))
        table_name = Event.objects.model._meta.db_table
        query = """SELECT * FROM (SELECT *, (((acos(sin(({0} * pi()/ 180)) * sin((`lat` * pi()/ 180)) 
        + cos(({0} * pi()/ 180)) * cos((`lat` * pi()/ 180)) * cos((({1} - `lon`)* pi()/ 180))))* 180 / pi()) 
        * 60 * 1.1515 * 1.609344) as distance 
            FROM `{3}` ) myTable WHERE distance <= {2}""".format(lat, lon, distance, table_name)
        events = Event.objects.raw(query)
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
