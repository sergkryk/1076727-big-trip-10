
import TripDayComponent from '../components/day.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {dates} from '../mock/mock.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._tripDaysList = new TripDaysListComponent();
  }

  render(events) {
    render(this._container, this._tripDaysList, RenderPosition.BEFOREEND);
    dates.forEach((date, dateIndex) => {
      const day = new TripDayComponent(date, dateIndex);
      const eventsList = day.getElement().querySelector(`.trip-events__list`);
      events
        .filter((_event) => new Date(_event.startDate).toDateString() === date)
        .forEach((_event) => {
          const event = new EventComponent(_event);
          const eventEdit = new EventEditComponent(_event);
          const replaceEditElement = () => {
            replace(event, eventEdit);
          };
          const onEscPress = (evt) => {
            const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
            if (isEscKey) {
              replaceEditElement();
              document.removeEventListener(`keydown`, onEscPress);
            }
          };
          eventEdit.setSubmitClickHandler((evt) => {
            evt.preventDefault();
            replaceEditElement();
          });
          event.setRollUpButtonClickHandler(() => {
            replace(eventEdit, event);
            document.addEventListener(`keydown`, onEscPress);
          });
          render(eventsList, event, RenderPosition.BEFOREEND);
        });
      render(this._tripDaysList.getElement(), day, RenderPosition.BEFOREEND);
    });
  }
}


