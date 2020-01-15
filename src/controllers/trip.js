import {formatFullDate} from '../utils/format.js';
import TripDayComponent from '../components/day.js';
import TripInfoComponent from '../components/trip-info.js';
import PointController from '../controllers/point.js';
import SortFormComponent from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import {SORT_TYPE, MODE, EMPTY_POINT} from '../const.js';

const HIDDEN_CLASS = `visually-hidden`;

const renderEvents = (container, events, onDataChange, onViewChange, isSorted = true) => {
  const pointControllers = [];

  const days = isSorted
    ? [...new Set(events.map((item) => formatFullDate(item.startDate)))]
    : [true];

  days.forEach((date, dateIndex) => {
    const tripDayComponent = isSorted
      ? new TripDayComponent(date, dateIndex + 1)
      : new TripDayComponent();

    renderElement(container, tripDayComponent);

    events
      .filter((event) => isSorted
        ? formatFullDate(event.startDate) === date
        : event)
      .forEach((event) => {
        const pointController = new PointController(tripDayComponent.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);

        pointController.render(event, MODE.DEFAULT);
        pointControllers.push(pointController);
      });
  });
  return pointControllers;
};


export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;

    this._pointControllers = [];
    this._pointsModel = pointsModel;
    this._isSorted = true;
    this._creatingPoint = null;

    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();
    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _calculateTotalTripCost() {
    const totalPrice = this._pointsModel.getPoints()
      .reduce((totalCost, value) => totalCost + value.price +
        value.offers
          .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0),
      0);
    document.querySelector(`.trip-info__cost-value`).textContent = totalPrice;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EMPTY_POINT) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, MODE.DEFAULT);

        this._pointControllers = [].concat(pointController, this._pointControllers);

        this._removePoints();
        this._renderPoints(this._pointsModel.getPoints());
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, MODE.DEFAULT);
      }
    }

    this._tripInfoComponent.rerender(this._pointsModel.getPointsAll());
    this._calculateTotalTripCost();
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
    let sortedPoints = [];
    const points = this._pointsModel.getPoints();

    this._isSorted = sortType === SORT_TYPE.EVENT;

    switch (sortType) {
      case SORT_TYPE.TIME:
        sortedPoints = points.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SORT_TYPE.PRICE:
        sortedPoints = points.slice().sort((a, b) => b.price - a.price);
        break;
      case SORT_TYPE.EVENT:
        sortedPoints = points.slice().sort((a, b) => a.startDate - b.startDate);
        break;
    }
    this._tripDaysList.getElement().innerHTML = ``;
    this._renderPoints(sortedPoints);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _removePoints() {
    this._tripDaysList.getElement().innerHTML = ``;
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _renderPoints(points) {
    this._pointControllers = renderEvents(this._tripDaysList.getElement(), points, this._onDataChange, this._onViewChange, this._isSorted);

    this._calculateTotalTripCost();
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(this._sortComponent.getElement(), this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EMPTY_POINT, MODE.ADDING);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      renderElement(container, this._noEventsComponent);
      return;
    }

    const tripInfo = document.querySelector(`.trip-main__trip-info`);
    this._tripInfoComponent = new TripInfoComponent(this._pointsModel.getPointsAll());
    renderElement(tripInfo, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    renderElement(this._container, this._sortComponent);
    renderElement(this._container, this._tripDaysList);

    this._renderPoints(points);

    tripInfo.querySelector(`.trip-info__cost-value`).textContent = points
    .reduce((totalCost, value) => totalCost + value.price + value.offers
    .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0), 0);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }
}
