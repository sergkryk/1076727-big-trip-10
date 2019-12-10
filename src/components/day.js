import {createTripEventsListTemplate} from './trip-events-list.js';
import {MONTH_NAMES} from '../const.js';

const convertMonthToString = (index) => {
  return MONTH_NAMES[index];
};

export const createTripDayTemplate = (date, index) => {
  const day = new Date(date);
  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${date}">${convertMonthToString(index)} ${day.getDate()}</time>
      </div>
      ${createTripEventsListTemplate()}
    </li>
  `;
};
