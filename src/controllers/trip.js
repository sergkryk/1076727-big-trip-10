import {formatFullDate} from '../utils/format.js';
import TripDayComponent from '../components/day.js';
import TripInfoComponent from '../components/trip-info.js';
import PointController from '../controllers/point.js';
import SortFormComponent from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {SORT_TYPE} from '../const.js';

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._pointControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }
    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    let isSorted = sortType === SORT_TYPE.EVENT;
    const events = this._pointsModel.getPoints();

    switch (sortType) {
      case SORT_TYPE.TIME:
        sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SORT_TYPE.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
        break;
      case SORT_TYPE.EVENT:
        sortedEvents = events.slice();
        break;
    }
    this._tripDaysList.getElement().innerHTML = ``;
    this._eventControllers = this._renderEvents(sortedEvents, this._onDataChange, this._onViewChange, isSorted);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _renderEvents(events, onDataChange, onViewChange, isSorted = true) {
    const pointControllers = [];
    const days = isSorted ? [...new Set(events.map((item) => formatFullDate(item.startDate)))] : [true];
    days.forEach((date, dateIndex) => {
      const tripDayComponent = isSorted ? new TripDayComponent(date, dateIndex + 1) : new TripDayComponent();
      renderElement(this._tripDaysList.getElement(), tripDayComponent);

      events
        .filter((event) => isSorted ? formatFullDate(event.startDate) === date : event)
        .forEach((event) => {
          const pointController = new PointController(tripDayComponent.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
          pointController.render(event);
          pointControllers.push(pointController);
        });
    });
    this._pointControllers = pointControllers;
    // return pointControllers;
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      renderElement(container, this._noEventsComponent);
      return;
    }

    const tripInfo = document.querySelector(`.trip-main__trip-info`);
    renderElement(tripInfo, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);

    renderElement(this._container, this._sortComponent);
    renderElement(this._container, this._tripDaysList);

    this._renderEvents(points, this._onDataChange, this._onViewChange);

    tripInfo.querySelector(`.trip-info__cost-value`).textContent = points
    .reduce((totalCost, value) => totalCost + value.price + value.offers
    .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0), 0);
  }
}
