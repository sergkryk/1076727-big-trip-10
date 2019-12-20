import TripController from './controllers/trip.js';
import TripInfoComponent from './components/trip-info.js';
import SiteMenuComponent from './components/menu.js';
import FilterFormComponent from './components/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {events} from './mock/mock.js';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMenu, new SiteMenuComponent(MENU_ITEMS), RenderPosition.BEFOREEND);
render(tripMenu, new FilterFormComponent(FILTERS), RenderPosition.BEFOREEND);
render(tripInfo, new TripInfoComponent(events), RenderPosition.AFTERBEGIN);

const tripCost = events.reduce((acc, value) => acc + value.price, 0);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;

const tripController = new TripController(tripEvents);

tripController.render(events);
