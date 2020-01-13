import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import SiteMenuComponent from './components/menu.js';
import FilterFormComponent from './components/filter.js';
import {renderElement} from './utils/render.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/mock.js';


const tripMenu = document.querySelector(`.trip-main__trip-controls`);

renderElement(tripMenu, new SiteMenuComponent(MENU_ITEMS));
renderElement(tripMenu, new FilterFormComponent(FILTERS));

const tripEvents = document.querySelector(`.trip-events`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const tripController = new TripController(tripEvents, pointsModel);
tripController.render();
