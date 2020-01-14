import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import PointsModel from './models/points.js';
import SiteMenuComponent from './components/menu.js';
import {renderElement} from './utils/render.js';
import {MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/mock.js';


const tripMenu = document.querySelector(`.trip-main__trip-controls`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

renderElement(tripMenu, new SiteMenuComponent(MENU_ITEMS));

const filterController = new FilterController(tripMenu, pointsModel);
filterController.render();

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, pointsModel);
tripController.render();

document.querySelector(`.trip-main__event-add-btn`)
   .addEventListener(`click`, () => {
     tripController.createEvent();
   });
