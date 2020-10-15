import { ActionTree } from 'vuex';
import Vue from 'vue';
import { AdminReportsState, RootState } from '@/store/types';
import axios from 'axios';

import { APIAdminBooking } from '@/types/admin/AdminBooking';
import { convertAPIBookingToKoieNameSlug, convertAPIReportToAdminReport } from './helpers';
import getReportData from '../../../../../tests/unit/__mocks__/reports';
import APIAdminReport from '@/types/admin/APIAdminReport';

export const actions: ActionTree<AdminReportsState, RootState> = {
  async MOUNT_CABINS({ commit }) {
    try {
      const res = await axios.get(Vue.prototype.$apiUrl + '/koie/availability?days=0');
      for (const cabin of res.data.koier as Array<APIAdminBooking>) {
        commit('setCabins', convertAPIBookingToKoieNameSlug(cabin));
      }
    } catch (e) {
      console.log(e);
    }
  },
  async MOUNT_REPORTS({ commit }) {
    commit('clearAllReports');
    const res = getReportData();
    let i = 0;
    for (const report of res) {
      report.id = i++;
      commit('setReport', convertAPIReportToAdminReport(report));
    }
  },
  async MOUNT_REPORTS_FOR_CABIN({ commit, dispatch }, payload: string) {
    if (!payload) {
      dispatch('MOUNT_REPORTS');
      return;
    }
    commit('clearAllReports');
    try {
      const res = await axios.get(Vue.prototype.$apiUrl + '/koie/reports/' + payload);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  },
};
