import {createTripDayTemplate} from './day.js';

export const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days">
    ${createTripDayTemplate()}
  </ul>`
  );
};
