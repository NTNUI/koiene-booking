<template>
  <v-col cols="4">
    <h5 style="text-align: center">Velg dato</h5>
    <v-menu
      v-model="showDatePicker"
      :close-on-content-click="false"
      :nudge-right="20"
      :nudge-top="20"
      :first-day-of-week="1"
      transition="scale-transition"
      offset-y
      min-width="290px"
      no-title
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field :label="startDate" prepend-icon="event" readonly v-bind="attrs" v-on="on"></v-text-field>
      </template>
      <v-date-picker :first-day-of-week="1" @input="selectDate" />
    </v-menu>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { addToDate } from '@/utils/dates';

export default Vue.extend({
  name: 'DatePicker',
  data() {
    return {
      showDatePicker: false,
    };
  },
  computed: {
    startDate() {
      return store.getters['adminBookings/getStartDate'];
    },
  },
  methods: {
    selectDate(startDate: string) {
      this.showDatePicker = false;
      store.commit('adminBookings/setStartDate', startDate);
      const endDate = addToDate(startDate, 7, 'day');
      store.dispatch('adminBookings/MOUNT_CABINS_WITH_BOOKINGS', { startDate: startDate, endDate: endDate });
    },
  },
});
</script>

<style scoped></style>
