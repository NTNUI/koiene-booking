import dayjs from 'dayjs';
import { addToDate, formatDate } from '@/utils/dates';
import { Dictionary } from 'vue-router/types/router';

require('dayjs/locale/nb');
dayjs.locale('nb');

describe('util Function addToDate', () => {
  function run(startDate: string, howMany: number, timeUnit: dayjs.OpUnitType, expected: string): void {
    it('adds ' + howMany + ' ' + timeUnit + ' to date ' + startDate, () => {
      const resultDate = addToDate(startDate, howMany, timeUnit);

      expect(resultDate).toEqual(expected);
    });
  }

  interface addToDateTestInput {
    startDate: string;
    howMany: number;
    timeUnit: dayjs.OpUnitType;
  }
  const inputs: Array<addToDateTestInput> = [
    { startDate: '2020-01-01', howMany: 3, timeUnit: 'day' },
    { startDate: '2020-01-01', howMany: -3, timeUnit: 'week' },
    { startDate: '2020-01-31', howMany: 1, timeUnit: 'month' },
    { startDate: '2020-01-01', howMany: 2, timeUnit: 'year' },
    { startDate: '2020-01-01', howMany: 50, timeUnit: 'day' },
  ];
  const expected: string[] = ['2020-01-04', '2019-12-11', '2020-02-29', '2022-01-01', '2020-02-20'];

  for (let i = 0; i < inputs.length; i++) {
    run(inputs[i].startDate, inputs[i].howMany, inputs[i].timeUnit, expected[i]);
  }
});

describe('util Function formatDate', () => {
  function run(dateISO: string, formatString: string, expected: string) {
    it('formats the date ' + dateISO + ' to the format ' + formatString, () => {
      const formattedDateString = formatDate(dateISO, formatString);

      expect(formattedDateString).toEqual(expected);
    });
  }

  const inputs: Array<Dictionary<string>> = [
    { dateISO: '2020-01-01', formatString: 'D. MMMM YYYY' },
    { dateISO: '2020-02-24', formatString: 'MM/DD/YY' },
    { dateISO: '2020-10-10', formatString: 'dddd' },
    { dateISO: '2020-10-12', formatString: 'dd D.M.YYYY' },
  ];
  const expected: string[] = ['1. januar 2020', '02/24/20', 'lørdag', 'ma 12.10.2020']

  for (let i = 0; i < inputs.length; i++) {
    run(inputs[i].dateISO, inputs[i].formatString, expected[i]);
  }
});
