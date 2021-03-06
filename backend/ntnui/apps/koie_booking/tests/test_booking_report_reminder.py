from datetime import date, timedelta

import pytest

from groups.factories.group_factory import GroupFactory
from koie_booking.factories.booking_factory import BookingFactory
from koie_booking.factories.koie_factory import KoieFactory
from koie_booking.reminder import send_departure_report_reminder


@pytest.fixture()
def koie():
    return KoieFactory()


@pytest.fixture(autouse=True)
def koie_group():
    return GroupFactory(name="Koiene")


@pytest.fixture()
def booking():
    today = date.today()
    tomorrow = today + timedelta(days=1)
    return (
        BookingFactory(contact_email="test1@gmail.com", departure_date=today),
        BookingFactory(contact_email="test1@gmail.com", departure_date=tomorrow),
    )


@pytest.mark.django_db
def test_send_reminder_to_todays_departures(booking, mailoutbox):
    """
        Test the reminder email cron job that checks every day if there is a trip finishing today.
    """
    send_departure_report_reminder()

    assert len(mailoutbox) == 1
    assert mailoutbox[0].subject == "Important: Cabin Checklist"
    assert mailoutbox[0].from_email == "TestKoieneNTNUI@gmail.com"
    assert mailoutbox[0].to == ["test1@gmail.com"]
