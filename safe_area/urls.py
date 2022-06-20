from django.urls import path
from .views import index, about, contact_us
from .api import GetEvents, PostEvent, PostEventMedia, DeleteEventMedia, GetEvent, PostFeedback

urlpatterns = [
    path('', index, name='home'),
    path('about', about, name='about'),
    path('contact-us', contact_us, name='contact_us'),

    path('api/get_events', GetEvents.as_view(), name='api-get-events'),
    path('api/get_event/<int:pk>', GetEvent.as_view(), name='api-get-event'),
    path('api/create_event', PostEvent.as_view(), name='api-create-event'),
    path('api/upload_media', PostEventMedia.as_view(), name='api-upload-media'),
    path('api/delete_media/<int:pk>', DeleteEventMedia.as_view(), name='api-delete-media'),

    path('api/send-feedback', PostFeedback.as_view(), name='api-send-feedback'),

    # path('create-random-events/<int:number>', create_random_events)
]