
import TripDayComponent from '../components/day.js';
import PointController from '../controllers/point.js';
import SortFormComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {dates} from '../mock/mock.js';
import {render, RenderPosition} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._events = [];
    this._pointControllers = [];
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _renderEvents(events, parent, onDataChange, onViewChange, isSorted = true) {
    const pointControllers = [];
    const days = isSorted ? [...new Set(dates)] : [true];
    days.forEach((date, dateIndex) => {
      const day = isSorted ? new TripDayComponent(date, dateIndex) : new TripDayComponent();
      const eventsByDate = isSorted ? [...events.filter((_event) => new Date(_event.startDate).toDateString() === date)] : events;
      eventsByDate.forEach((_event) => {
        const point = new PointController(day.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
        point.render(_event);
        pointControllers.push(point);
      });
      render(parent, day, RenderPosition.BEFOREEND);
    });
    this._pointControllers = pointControllers;
  }

  render(events) {
    this._events = events;

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysList, RenderPosition.BEFOREEND);
    this._renderEvents(events, this._tripDaysList.getElement(), this._onDataChange, this._onViewChange);

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
      this._renderEvents(sortedEvents, this._tripDaysList.getElement(), this._onDataChange, this._onViewChange, isSorted);
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

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
