
import TripDayComponent from '../components/day.js';
import SortFormComponent, {SortType} from '../components/sort.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {dates} from '../mock/mock.js';
import {render, RenderPosition, replace} from '../utils/render.js';

const renderEvents = (events, parent) => {
  events.forEach((_event) => {
    const event = new EventComponent(_event);
    const eventEdit = new EventEditComponent(_event);
    const replaceEditElement = () => {
      replace(event, eventEdit);
    };
    const onEscPress = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        replaceEditElement();
        document.removeEventListener(`keydown`, onEscPress);
      }
    };
    eventEdit.setSubmitClickHandler((evt) => {
      evt.preventDefault();
      replaceEditElement();
    });
    event.setRollUpButtonClickHandler(() => {
      replace(eventEdit, event);
      document.addEventListener(`keydown`, onEscPress);
    });
    render(parent, event, RenderPosition.BEFOREEND);
  });
};

const renderDays = (events, parent) => {
  dates.forEach((date, dateIndex) => {
    const day = new TripDayComponent(date, dateIndex);
    const eventsList = day.getElement().querySelector(`.trip-events__list`);
    const eventsByDate = [...events.filter((_event) => new Date(_event.startDate).toDateString() === date)];
    renderEvents(eventsByDate, eventsList);
    render(parent, day, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();
  }

  render(events) {
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysList, RenderPosition.BEFOREEND);
    renderDays(events, this._tripDaysList.getElement());

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];
      this._tripDaysList.getElement().innerHTML = ``;
      render(this._tripDaysList.getElement(), new TripDayComponent(), RenderPosition.BEFOREEND);
      const list = document.querySelector(`.trip-events__list`);


      switch (sortType) {
        case SortType.TIME:
          sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
          renderEvents(sortedEvents, list);
          break;
        case SortType.PRICE:
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          renderEvents(sortedEvents, list);
          break;
        case SortType.EVENT:
          sortedEvents = events.slice(0, 10);
          renderDays(events, this._tripDaysList.getElement());
          break;
      }
    });
  }
}
