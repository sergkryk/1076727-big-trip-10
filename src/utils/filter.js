import {FILTERS} from '../const.js';

export const getEverythingPoints = (points) => {
  return points.slice().sort((a, b) => a.startDate - b.startDate);
};

export const getFuturePoints = (points) => {
  return points.filter((point) => point.startDate > Date.now());
};

export const getPastPoints = (points) => {
  return points.filter((point) => point.startDate < Date.now());
};

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FILTERS.EVERYTHING:
      return getEverythingPoints(points);
    case FILTERS.FUTURE:
      return getFuturePoints(points);
    case FILTERS.PAST:
      return getPastPoints(points);
  }

  return points;
};
