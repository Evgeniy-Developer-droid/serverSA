import time
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveAPIView
from .serializers import EventSerializer, EventMediaSerializer, SingleEventSerializer, FeedbackSerializer
from .models import Event, EventMedia, Feedback
from math import pi, cos
from django.conf import settings
from datetime import datetime


class PostFeedback(CreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()


class GetEvent(RetrieveAPIView):
    serializer_class = SingleEventSerializer
    queryset = Event.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            event = Event.objects.get(pk=kwargs['pk'])
            event.viewed += 1
            event.save()
        except (Event.DoesNotExist, KeyError) as er:
            print(er)
        return self.retrieve(request, *args, **kwargs)


class GetEvents(ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def get_distance(self, zoom, lat):
        coef = 106543.03392
        if zoom >= 10:
            coef = 96543.03392
        return format(coef * cos(lat * pi / 180) / 2**zoom, '.4f')

    def create_types_query(self, types, db='mysql'):
        query = " AND (`type_of_situation` IN (" if db == 'mysql' else " AND (type_of_situation IN ("
        for t in types:
            query += "\'"+t+"\',"
        query = query[:-1]
        return query+"))"

    def list(self, request):
        lat = request.GET.get('lat', 0)
        lon = request.GET.get('lon', 0)
        zoom = request.GET.get('zoom', 0)
        date = {
            'start': datetime.strptime(request.GET.get('start')+" 00:00:00", '%Y-%m-%d %H:%M:%S'),
            'end': datetime.strptime(request.GET.get('end')+" 23:59:59", '%Y-%m-%d %H:%M:%S')
        }
        types = request.GET.get('types').split('|') if request.GET.get('types') else []

        distance = self.get_distance(int(zoom), float(lat))
        table_name = Event.objects.model._meta.db_table
        if settings.DEBUG:
            query = """SELECT * FROM (SELECT *, (((acos(sin(({0} * pi()/ 180)) * sin((`lat` * pi()/ 180)) 
            + cos(({0} * pi()/ 180)) * cos((`lat` * pi()/ 180)) * cos((({1} - `lon`)* pi()/ 180))))* 180 / pi()) 
            * 60 * 1.1515 * 1.609344) as distance 
                FROM `{3}` ) myTable WHERE distance <= {2} AND 
                (`timestamp` BETWEEN '{4}' AND '{5}')""".format(lat, lon, distance, table_name, date['start'], date['end'])
            if types:
                query += self.create_types_query(types)
            query += " ORDER BY `viewed`, `timestamp`"
        else:
            query = """SELECT * FROM (SELECT *, (((acos(sin(({0} * pi()/ 180)) * sin((lat * pi()/ 180)) 
                        + cos(({0} * pi()/ 180)) * cos((lat * pi()/ 180)) * cos((({1} - lon)* pi()/ 180))))* 180 / pi()) 
                        * 60 * 1.1515 * 1.609344) as distance 
                            FROM {3} ) myTable WHERE distance <= {2} AND 
                (timestamp BETWEEN '{4}' AND '{5}')""".format(lat, lon, distance, table_name, date['start'], date['end'])
            if types:
                query += self.create_types_query(types, 'postgresql')
            query += " ORDER BY viewed, timestamp"
        if int(zoom) <= 10:
            query += " LIMIT "+str(100*int(zoom))
        print(query)
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
