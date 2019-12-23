
import TripDayComponent from '../components/day.js';
import PointController from '../controllers/point.js';
import SortFormComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {dates} from '../mock/mock.js';
import {render, RenderPosition} from '../utils/render.js';

const renderEvents = (events, parent, isSorted = true) => {
  const days = isSorted ? [...new Set(dates)] : [true];
  days.forEach((date, dateIndex) => {
    const day = isSorted ? new TripDayComponent(date, dateIndex) : new TripDayComponent();
    const eventsByDate = isSorted ? [...events.filter((_event) => new Date(_event.startDate).toDateString() === date)] : events;
    eventsByDate.forEach((_event) => {
      const point = new PointController(day.getElement().querySelector(`.trip-events__list`));
      point.render(_event);
    });
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
    renderEvents(events, this._tripDaysList.getElement());

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];
      let isSorted = true;

      switch (sortType) {
        case SortType.TIME:
          isSorted = false;
          sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
          break;
        case SortType.PRICE:
          isSorted = false;
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          break;
        case SortType.EVENT:
          sortedEvents = events;
          break;
      }
      this._tripDaysList.getElement().innerHTML = ``;
      renderEvents(sortedEvents, this._tripDaysList.getElement(), isSorted);
    });
  }
}
