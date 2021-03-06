<template>
  <v-container class="global-max-width">
    <v-row>
      <v-col cols="12" sm="8" class="mx-auto" :class="$style.mainColumn">
        <v-stepper v-model="step" alt-labels :class="$style.stepper">
          <v-stepper-header :class="$style.stepperHeader">
            <v-stepper-step :complete="step > 1" :step="1">
              {{ $t('report.step1') }}
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 2" :step="2">
              {{ $t('report.step2') }}
            </v-stepper-step>
            <v-divider v-if="hasBoatEquipment"></v-divider
            ><v-stepper-step v-if="hasBoatEquipment" :complete="step > steps - 2" :step="steps - 2">
              {{ $t('report.step3') }}
            </v-stepper-step>
            <v-divider></v-divider
            ><v-stepper-step :complete="step > steps - 1" :step="steps - 1">
              {{ $t('report.step4') }}
            </v-stepper-step>
          </v-stepper-header>
          <v-layout>
            <ErrorCard v-if="apiError" />
            <LoadingSpinner v-else-if="isLoading" />
            <ReportFirstStep v-else-if="step === 1" />
            <ReportSecondStep v-else-if="step === 2" />
            <ReportThirdStep v-else-if="hasBoatEquipment && step === steps - 2" />
            <ReportFourthStep v-else-if="step === steps - 1" />
            <ThankYouStep v-else-if="step === steps" />
          </v-layout>
        </v-stepper>
        <div v-show="step < steps && !isLoading && !apiError" :class="$style.btnWrapper">
          <v-btn
            v-if="step > 1"
            :color="this.$scssVars.globalColorPrimary"
            raised="true"
            :dark="true"
            data-test="btnPrev"
            @click="prevStep(step)"
            >{{ $t('report.back_button') }}</v-btn
          >
          <v-btn
            v-if="step < steps - 1"
            :disabled="!isValid"
            :color="this.$scssVars.globalColorPrimary"
            :class="$style.nextStepButton"
            raised="true"
            :dark="true"
            data-test="btnNext"
            @click="nextStep(step)"
            >{{ $t('report.next_button') }}</v-btn
          >
          <v-btn
            v-if="step === steps - 1"
            :color="this.$scssVars.globalColorPrimary"
            :class="$style.nextStepButton"
            raised="true"
            :dark="true"
            data-test="btnDone"
            @click="done"
            >{{ $t('report.done_button') }}</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ErrorCard from '@/components/ErrorCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ReportFirstStep from '@/components/report/ReportFirstStep.vue';
import ReportSecondStep from '@/components/report/ReportSecondStep.vue';
import ReportThirdStep from '@/components/report/ReportThirdStep.vue';
import ReportFourthStep from '@/components/report/ReportFourthStep.vue';
import ThankYouStep from '@/components/report/ThankYouStep.vue';
import { ReportData } from '../types/report';
import Vue from 'vue';

export default Vue.extend({
  name: 'Report',

  components: {
    ErrorCard,
    LoadingSpinner,
    ReportFirstStep,
    ReportSecondStep,
    ReportThirdStep,
    ReportFourthStep,
    ThankYouStep,
  },

  data(): ReportData {
    return {
      step: 1,
    };
  },

  computed: {
    steps(): number {
      if (this.$store.getters['report/hasBoatEquipment']) {
        return 5;
      }
      return 4;
    },
    isValid(): string {
      return this.$store.state.report.validForm;
    },
    isLoading(): boolean {
      return this.$store.state.report.isLoading;
    },
    apiError(): boolean {
      return this.$store.state.report.error;
    },
    hasBoatEquipment(): boolean {
      return this.$store.getters['report/hasBoatEquipment'];
    },
  },

  mounted() {
    const bookingID = String(this.$route.params.booking_uuid);
    this.step = 1;
    this.$store.commit('report/setStep', 1);
    this.$store.commit('report/setValidForm', true);
    this.$store.commit('report/setEdited', false);
    this.$store.commit('report/setBookingID', bookingID);
    this.$store.dispatch('report/FETCH_BOOKING', bookingID);
  },

  methods: {
    nextStep(n: number) {
      this.step = ++n;
      this.$store.commit('report/setStep', this.step);
    },
    prevStep(n: number) {
      this.step = --n;
      this.$store.commit('report/setStep', this.step);
      if (this.step === 1) {
        this.$store.commit('report/setValidForm', true);
      }
    },
    done() {
      this.nextStep(this.step);
      this.$store.dispatch('report/CREATE_REPORT', this.$store.state.report.reportData);
    },
  },
});
</script>

<style lang="scss" module>
.mainColumn {
  @media only screen and (max-width: 600px) {
    padding-left: 0px;
    padding-right: 0px;
  }
}

.stepper {
  min-height: 80vh;
  box-shadow: none;
  background: none !important;
  @media only screen and (min-width: 1500px) {
    min-height: 60vh;
  }
}
.stepperHeader {
  box-shadow: none;
}

.btnWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 5%;
}
.nextStepButton {
  margin-left: 20px;
}
.errorMsg {
  margin: 10px 16px 10px 16px;
}
</style>
