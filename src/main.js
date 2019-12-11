import TripInfoComponent from './components/trip-info.js';
import SiteMenuComponent from './components/menu.js';
import FilterFormComponent from './components/filter.js';
import SortFormComponent from './components/sort.js';
import TripDaysListComponent from './components/trip-days-list.js';
import TripDayComponent from './components/day.js';
import EventComponent from './components/event.js';
import {render, RenderPosition} from './utils.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {events, dates} from './mock/mock.js';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripInfo, new TripInfoComponent(events).getElement(), RenderPosition.AFTERBEGIN);
render(tripMenu, new SiteMenuComponent(MENU_ITEMS).getElement(), RenderPosition.BEFOREEND);
render(tripMenu, new FilterFormComponent(FILTERS).getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new SortFormComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new TripDaysListComponent().getElement(), RenderPosition.BEFOREEND);

const tripDaysList = document.querySelector(`.trip-days`);

dates.forEach((date, dateIndex) => {
  const day = new TripDayComponent(date, dateIndex).getElement();
  const eventsList = day.querySelector(`.trip-events__list`);

  events
  .filter((_event) => new Date(_event.startDate).toDateString() === date)
  .forEach((_event) => {
    render(eventsList, new EventComponent(_event).getElement(), RenderPosition.BEFOREEND);
  });

  render(tripDaysList, day, RenderPosition.BEFOREEND);
});

const tripCost = events.reduce((acc, value) => acc + value.price, 0);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;
