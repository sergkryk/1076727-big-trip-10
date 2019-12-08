import {createTripEventsListTemplate} from './trip-events-list.js';

export const createTripDayTemplate = () => {
  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>
      ${createTripEventsListTemplate()}
    </li>
  `;
};
