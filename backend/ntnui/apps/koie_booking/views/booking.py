from django.core.exceptions import ValidationError
from django.template.defaultfilters import slugify
from rest_framework import mixins, viewsets
from rest_framework.response import Response

from koie_booking.models.booking import BookingModel
from koie_booking.models.booking_payment import BookingPayment
from koie_booking.serializers.booking import BookingSerializer

from django.utils.translation import gettext as _


class BookingViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = BookingModel.objects.all()
    serializer_class = BookingSerializer
    lookup_field = "uuid"

    def list(self, request):
        bookings = BookingModel.objects.all()
        serializer = BookingSerializer(bookings, context={"request": request}, many=True)
        return Response(serializer.data)

    def create(self, request):
        request_data = request.data.copy()
        koie_slug = request.data.get("koie", None)
        if koie_slug:
            request_data["koie"] = slugify(koie_slug)
        else:
            return Response({"detail": "koie_slug is missing"}, status=400)
        serializer = BookingSerializer(data=request_data)
        if serializer.is_valid():
            try:
                booking = BookingModel.objects.create(
                    user=request.user,
                    booking_payment=BookingPayment.objects.create(price=1),
                    **serializer.validated_data
                )
                booking.booking_payment.price = booking.get_total_price()
                booking.save()
                return Response(
                    {
                        "booking": BookingSerializer(
                            booking, context={"request": request}, many=False
                        ).data
                    }
                )
            except ValidationError:
                return Response({"detail": _("Could not create booking")}, status=400)
        else:
            return Response({"detail": serializer.errors}, status=400)

    def retrieve(self, request, uuid):
        try:
            booking = self.queryset.get(uuid=uuid)
            serializer = BookingSerializer(booking, context={"request": request})
            return Response({"booking": serializer.data})
        except BookingModel.DoesNotExist:
            return Response({"detail": _("Booking not found.")}, status=404)
