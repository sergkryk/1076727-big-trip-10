
import TripDayComponent from '../components/day.js';

import PointController from '../controllers/point.js';
import SortFormComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {renderElement} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    // this._pointControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();

    this._onDataChange = this._onDataChange.bind(this);
    // this._onViewChange = this._onViewChange.bind(this);
  }

  _renderEvents(events, isSorted = true) {
    // const pointControllers = [];
    const days = isSorted ? [...new Set(events.map((item) => new Date(item.startDate).toDateString()))] : [true];
    days.forEach((date, dateIndex) => {
      const tripDayComponent = isSorted ? new TripDayComponent(date, dateIndex + 1) : new TripDayComponent();
      renderElement(this._tripDaysList.getElement(), tripDayComponent);

      events
        .filter((event) => isSorted ? new Date(event.startDate).toDateString() === date : event)
        .forEach((event) => {
          const pointController = new PointController(tripDayComponent.getElement().querySelector(`.trip-events__list`), this._onDataChange);
          pointController.render(event);
        });
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  // _onViewChange() {
  //   this._pointControllers.forEach((it) => it.setDefaultView());
  // }

  render(events) {
    this._events = events;

    renderElement(this._container, this._sortComponent);
    renderElement(this._container, this._tripDaysList);

    this._renderEvents(events);

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
      this._renderEvents(sortedEvents, isSorted);
    });
  }
}
