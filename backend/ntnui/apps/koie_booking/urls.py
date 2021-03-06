from django.urls import include, path
from rest_framework import routers

from koie_booking.views.booking import BookingViewSet
from koie_booking.views.booking_sit import BookingSitViewSet
from koie_booking.views.koie import KoieViewSet
from koie_booking.views.koie_dashboard import KoieDashboardViewSet

router = routers.DefaultRouter()

router.register("koie", KoieViewSet, basename="koie")
router.register("booking", BookingViewSet, basename="booking")
router.register("sit", BookingSitViewSet, basename="sit")

router.register("availability", KoieDashboardViewSet)
""" Include URL Patterns """
urlpatterns = [path("", include(router.urls))]
