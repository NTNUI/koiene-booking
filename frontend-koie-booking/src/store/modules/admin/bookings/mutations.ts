import Vue from 'vue';
import { MutationTree } from 'vuex';
import { AdminBookingsState } from '@/store/types';
import AdminBooking from '@/types/admin/AdminBooking';

export const mutations: MutationTree<AdminBookingsState> = {
  setCabinWithBooking(state, payload: AdminBooking) {
    Vue.set(state.cabinsWithBookings, payload.slug, payload);
  },
  setStartDate(state, payload: string) {
    state.startDate = payload;
  },
  setLoading(state, payload: boolean) {
    state.loading = payload;
  },
  clearAllBookings(state) {
    state.cabinsWithBookings = {};
  },
};
