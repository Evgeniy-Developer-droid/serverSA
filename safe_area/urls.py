from django.urls import path
from .views import index
from .api import GetEvents, PostEvent, PostEventMedia, DeleteEventMedia

urlpatterns = [
    path('', index, name='home'),
    path('api/get_events', GetEvents.as_view(), name='api-get-events'),
    path('api/create_event', PostEvent.as_view(), name='api-create-event'),
    path('api/upload_media', PostEventMedia.as_view(), name='api-upload-media'),
    path('api/delete_media/<int:pk>', DeleteEventMedia.as_view(), name='api-delete-media')
]