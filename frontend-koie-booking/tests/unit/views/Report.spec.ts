import Vue from 'vue';
import Vuetify from 'vuetify';
import flushPromises from 'flush-promises';
import mockAxios from 'jest-mock-axios';

Vue.use(Vuetify);

// Utilities
import { Wrapper, ThisTypedShallowMountOptions } from '@vue/test-utils';
import { createWrapper } from '../utils';

// Components or views
import Report from '@/views/Report.vue';
import ReportFirstStep from '@/components/report/ReportFirstStep.vue';
import ReportSecondStep from '@/components/report/ReportSecondStep.vue';
import ReportThirdStep from '@/components/report/ReportThirdStep.vue';
import ReportFourthStep from '@/components/report/ReportFourthStep.vue';
import ThankYouStep from '@/components/report/ThankYouStep.vue';

describe('View Booking.vue', () => {
  let wrapper: Wrapper<any>;
  let wrapperOptions: ThisTypedShallowMountOptions<any>;

  beforeEach(() => {
    wrapperOptions = {
      mocks: {
        $route: {
          params: { booking_id: 1 },
        },
      },
    };
    wrapper = createWrapper(Report, wrapperOptions);
  });

  describe('with water equipment', () => {
    beforeEach(async () => {
      const response = { data: { booking: { koie: 'flåkoia' } } };
      mockAxios.mockResponse(response);
      await flushPromises();
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('Matches snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('Buttons should be hidden if report is loading', () => {
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('');
      wrapperOptions = {
        mocks: {
          $route: {
            params: { id: 1 },
          },
          computed: {
            isLoading() {
              return true;
            },
          },
        },
      };
      wrapper = createWrapper(Report, wrapperOptions);
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('none');
    });

    it('Buttons should be hidden if there is an api error', () => {
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('');
      wrapperOptions = {
        mocks: {
          $route: {
            params: { id: 1 },
          },
          computed: {
            apiError() {
              return true;
            },
          },
        },
      };
      wrapper = createWrapper(Report, wrapperOptions);
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('none');
    });

    it('Button_next renders next report step', () => {
      wrapper.find('[data-test="btnNext"]').trigger('click');

      expect(wrapper.contains(ReportSecondStep)).toBe(true);
      expect(wrapper.contains(ReportFirstStep)).toBe(false);
    });

    it('Button_prev renders prev report step', () => {
      wrapper.find('[data-test="btnNext"]').trigger('click');
      wrapper.find('[data-test="btnPrev"]').trigger('click');

      expect(wrapper.contains(ReportFirstStep)).toBe(true);
      expect(wrapper.contains(ReportSecondStep)).toBe(false);
    });

    it('Button_done renders thank you step', async () => {
      const btnNext = wrapper.find('[data-test="btnNext"]');
      btnNext.trigger('click');
      btnNext.trigger('click');
      btnNext.trigger('click');
      wrapper.find('[data-test="btnDone"]').trigger('click');

      const response = { data: {} };
      mockAxios.mockResponse(response);
      await flushPromises();

      expect(wrapper.contains(ThankYouStep)).toBe(true);
      expect(wrapper.contains(ReportFourthStep)).toBe(false);
    });
  });

  describe('without water equipment', () => {
    beforeEach(async () => {
      const response = { data: { booking: { koie: 'lyngli' } } };
      mockAxios.mockResponse(response);
      await flushPromises();
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('Matches snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('Buttons should be hidden if report is loading', () => {
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('');
      wrapperOptions = {
        mocks: {
          $route: {
            params: { id: 1 },
          },
          computed: {
            isLoading() {
              return true;
            },
          },
        },
      };
      wrapper = createWrapper(Report, wrapperOptions);
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('none');
    });

    it('Buttons should be hidden if there is an api error', () => {
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('');
      wrapperOptions = {
        mocks: {
          $route: {
            params: { id: 1 },
          },
          computed: {
            apiError() {
              return true;
            },
          },
        },
      };
      wrapper = createWrapper(Report, wrapperOptions);
      expect(wrapper.vm.$el.querySelector('.btnWrapper').style.display).toBe('none');
    });

    it('Button_next renders next report step', () => {
      wrapper.find('[data-test="btnNext"]').trigger('click');

      expect(wrapper.contains(ReportSecondStep)).toBe(true);
      expect(wrapper.contains(ReportFirstStep)).toBe(false);
    });

    it('Button_prev renders prev report step', () => {
      wrapper.find('[data-test="btnNext"]').trigger('click');
      wrapper.find('[data-test="btnPrev"]').trigger('click');

      expect(wrapper.contains(ReportFirstStep)).toBe(true);
      expect(wrapper.contains(ReportSecondStep)).toBe(false);
    });

    it('Button_done renders thank you step', async () => {
      const btnNext = wrapper.find('[data-test="btnNext"]');
      btnNext.trigger('click');
      btnNext.trigger('click');
      wrapper.find('[data-test="btnDone"]').trigger('click');

      const response = { data: {} };
      mockAxios.mockResponse(response);
      await flushPromises();

      expect(wrapper.contains(ThankYouStep)).toBe(true);
      expect(wrapper.contains(ReportThirdStep)).toBe(false);
    });
  });
});
