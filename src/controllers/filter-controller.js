import FilterComponent from '../components/filter.js';
import {replaceElement, renderElement} from '../utils/render.js';
import {FILTERS} from '../const.js';
import {getEventsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FILTERS.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEventsAll();

    const filters = Object.values(FILTERS)
      .map((filterType) => {
        return {
          name: filterType,
          checked: filterType === this._activeFilterType,
          disabled: getEventsByFilter(events, filterType).length === 0
        };
      });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceElement(this._filterComponent, oldComponent);
    } else {
      renderElement(container, this._filterComponent);
    }
  }
}
