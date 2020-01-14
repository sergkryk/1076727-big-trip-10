import TripController from './controllers/trip.js';
import StatisticsComponent from './components/statistics.js';
import FilterController from './controllers/filter.js';
import PointsModel from './models/points.js';
import SiteMenuComponent from './components/menu.js';
import {renderElement, RenderPosition} from './utils/render.js';
import {MenuItem} from './const.js';
import {generateEvents} from './mock/mock.js';


// const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageMainElement = document.querySelector(`.page-main`);

const events = generateEvents()
  .slice()
  .sort((a, b) => a.startDate - b.startDate);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

// renderElement(tripMenu, new SiteMenuComponent(MENU_ITEMS));
const menuItems = Object.values(MenuItem)
   .map((item) => {
     return {
       name: item,
       active: item === MenuItem.TABLE
     };
   });

// const filterController = new FilterController(tripMenu, pointsModel);
// filterController.render();
const menuComponent = new SiteMenuComponent(menuItems);
renderElement(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

// const tripEvents = document.querySelector(`.trip-events`);
const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

const statisticsComponent = new StatisticsComponent();
renderElement(pageMainElement.querySelector(`.page-body__container`), statisticsComponent);
statisticsComponent.hide();

document.querySelector(`.trip-main__event-add-btn`)
   .addEventListener(`click`, () => {
     tripController.createPoint();
   });

menuComponent.setItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});
