import {convertMonthToString} from '../utils.js';

export const createTripDayTemplate = (date, index) => {
  const day = new Date(date);
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${date}">${convertMonthToString(index)} ${day.getDate()}</time>
      </div>
      <ul class="trip-events__list">
    </ul>
    </li>
  `;
};
