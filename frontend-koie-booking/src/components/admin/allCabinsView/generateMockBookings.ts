import { KoieNameSlug } from '@/types/admin/AdminReports';
import store from '@/store/index';
import { BookingInfo, CreateBookingInfo, Guest } from '@/store/types';
import dayjs from 'dayjs';
import { addToDate } from '@/utils/dates';
import { booking } from '@/store/modules/users/booking';
import AdminBooking from '@/types/admin/AdminBooking';
import request from '@/service/request';
const { randomBytes } = require('crypto');

const createBooking = (koie: string, maxCap: number): any => {
  const { startDate, endDate } = getRandomStartAndEndDate();
  const guests = getRandomGuests(maxCap);
  return {
    arrival_date: startDate,
    departure_date: endDate,
    koie,
    guests,
    guests_member: Math.ceil(guests.length / 2),
    guests_not_member: Math.floor(guests.length / 2),
    contact_email: guests[0].email,
  };
};

const getRandomStartAndEndDate = (): { startDate: string; endDate: string } => {
  const refDate = dayjs().format('YYYY-MM-DD');
  const randomStartNumber = Math.ceil(Math.random() * 5);
  const startDate = addToDate(refDate, randomStartNumber, 'day');
  const endDateRef = dayjs()
    .add(randomStartNumber, 'day')
    .format('YYYY-MM-DD');
  const randomEndNumber = Math.ceil(Math.random() * 9);
  const endDate = addToDate(endDateRef, randomEndNumber, 'day');
  return { startDate, endDate };
};

const guests: string[] = [
  'Sondre Haltbakk',
  'Nicklas I Paus Bekkevold',
  'Adam Gaidi',
  'Oskar Størmer',
  'Ellen Zhang Chang',
  'Jesper Gayosso Paulsen',
  'Kåre Fosli Obrestad',
  'Victoria Ahmadi',
];

const randomEmails = ['@ntnuiisthebest.no', '@koieneismyhome.io', '@customerdrivesnisfun.com', '@sprintforlife.com'];

const getRandomGuest = (): Guest => {
  const name = guests[Math.floor(Math.random() * guests.length)];
  const emailPre = name.toLowerCase().replace(/ /g, '.');
  const email = emailPre + randomEmails[Math.floor(Math.random() * randomEmails.length)];
  return {
    name,
    email,
    isMember: Math.random() < 0.5,
    number: randomBytes(4).toString('hex'),
  };
};

const getRandomGuests = (maxCap: number): Guest[] => {
  const res = [];
  const randomAmountOfGuests = Math.floor(Math.random() * (maxCap + 1));

  for (let i = 0; i < randomAmountOfGuests + 1; i++) {
    res.push(getRandomGuest());
  }
  return res;
};

export const createMockData = async () => {
  const cabins: Array<AdminBooking> = store.getters['adminBookings/getCabinsWithBookingsArray'];
  for (const cabin of cabins) {
    if (!cabin.name || !cabin.numberOfBeds) continue;
    for (let i = 0; i < 10; i++) {
      const booking = createBooking(cabin.slug, cabin.numberOfBeds);
      try {
        await request({
          method: 'POST',
          url: '/koie/booking/',
          data: booking,
        });
        console.log('Booking complete!');
      } catch (e) {
        console.log('Booking failed :(');
      }
    }
  }
};