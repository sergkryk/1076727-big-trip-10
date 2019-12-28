import TripController from './controllers/trip.js';
import TripInfoComponent from './components/trip-info.js';
import SiteMenuComponent from './components/menu.js';
import FilterFormComponent from './components/filter.js';
import {renderElement, RenderPosition} from './utils/render.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/mock.js';


const tripMenu = document.querySelector(`.trip-main__trip-controls`);

renderElement(tripMenu, new SiteMenuComponent(MENU_ITEMS));
renderElement(tripMenu, new FilterFormComponent(FILTERS));

const tripEvents = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEvents);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

tripController.render(events);

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(tripInfo, new TripInfoComponent(events), RenderPosition.AFTERBEGIN);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = events.reduce((acc, value) => acc + value.price, 0);
