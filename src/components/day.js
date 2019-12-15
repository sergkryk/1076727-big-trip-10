import AbstractComponent from './abstract-component.js';

const createTripDayTemplate = (date, index) => {
  const day = new Date(date);
  const month = day.toLocaleString(`en`, {month: `short`});
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${date}">${month} ${day.getDate()}</time>
      </div>
      <ul class="trip-events__list">
    </ul>
    </li>
  `;
};

export default class TripDay extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._index);
  }
}
