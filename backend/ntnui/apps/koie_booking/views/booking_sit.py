from django.core.exceptions import ObjectDoesNotExist, ValidationError
from rest_framework import mixins, viewsets
from rest_framework.response import Response

from koie_booking.models.booking import BookingModel
from koie_booking.serializers.booking_sit import BookingSitSerializer
from koie_report.permissions import IsSitMemberOrKoieAdmin

from django.utils.translation import gettext as _


class BookingSitViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = BookingModel.objects.all()
    serializer_class = BookingSitSerializer
    lookup_field = "uuid"
    permission_classes = (IsSitMemberOrKoieAdmin,)

    def list(self, request):
        bookings = BookingModel.objects.all()
        serializer = BookingSitSerializer(bookings, context={"request": request}, many=True)
        return Response(serializer.data)

    def retrieve(self, request, uuid):
        try:
            booking = self.queryset.get(uuid=uuid)
            serializer = BookingSitSerializer(booking, context={"request": request})
            return Response({"booking": serializer.data})
        except BookingModel.DoesNotExist:
            return Response({"detail": _("Booking not found.")}, status=404)

    def update(self, request, *args, **kwargs):
        """ Returns a response saying that the method is not allowed. """

        return Response({"detail": "Not yet implemented use PATCH"}, status=400)

    def partial_update(self, request, uuid=None):
        """ Changes field: key_status. Requires fields key_status and koie to be specified """

        try:
            self.check_object_permissions(self.request, self.get_object())
            serializer = BookingSitSerializer(
                self.get_object(),
                context={"request": request},
                many=False,
                data=request.data,
                partial=True,
            )
            if serializer.is_valid():
                self.perform_update(serializer)
                return Response({"detail": _("Changes were made")})
            else:
                return Response({"detail": serializer.errors}, status=400)
        except BookingModel.DoesNotExist:
            return Response({"detail": "Could not find booking"}, status=400)
        except ObjectDoesNotExist:
            return Response({"detail": "Could not find object"}, status=400)
        except KeyError:
            return Response(
                {
                    "detail": "key_status can only be one of: 'not_picked_up', 'picked_up', 'delivered'"
                },
                status=400,
            )