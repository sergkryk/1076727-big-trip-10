import AbstractComponent from './abstract-component.js';

const createFiltersMarkup = ((filters) => {
  return filters
    .map((filter, index) => {
      return `<input
          id="filter-${filter}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filter}"
          ${index === 0 ? `checked` : ``}
        >
        <label class="trip-filters__filter-label" for="filter-${filter}">
          ${filter}
        </label>
      `;
    })
    .join(``);
});

export default class FilterForm extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
         <div class="trip-filters__filter">
         ${createFiltersMarkup(this._filters)}
         </div>
       </form>
     `;
  }
}
