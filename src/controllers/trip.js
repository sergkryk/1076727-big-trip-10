
import TripDayComponent from '../components/day.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import {dates} from '../mock/mock.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
  }

  render(events) {
    const isAllEventsArchived = events.every((element) => element.isArchived);
    const mainContainer = document.querySelector(`.page-main`);
    if (isAllEventsArchived) {
      render(mainContainer, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    const tripDaysList = document.querySelector(`.trip-days`);
    dates.forEach((date, dateIndex) => {
      const day = new TripDayComponent(date, dateIndex);
      const eventsList = day.getElement().querySelector(`.trip-events__list`);
      events
        .filter((_event) => new Date(_event.startDate).toDateString() === date)
        .forEach((_event) => {
          const event = new EventComponent(_event);
          const edit = new EventEditComponent(_event);
          // const editForm = edit.getElement().querySelector(`.event--edit`);
          const replaceEditElement = () => {
            replace(event, edit);
          };
          const onEscPress = (evt) => {
            const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
            if (isEscKey) {
              replaceEditElement();
              // editForm.reset();
              document.removeEventListener(`keydown`, onEscPress);
            }
          };
          edit.setSubmitClickHandler((evt) => {
            evt.preventDefault();
            replaceEditElement();
          });
          event.setRollUpButtonClickHandler(() => {
            replace(edit, event);
            document.addEventListener(`keydown`, onEscPress);
          });
          render(eventsList, event, RenderPosition.BEFOREEND);
        });
      render(tripDaysList, day, RenderPosition.BEFOREEND);
    });
  }
}


