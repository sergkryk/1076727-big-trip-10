import {EVENT_TYPES} from '../const';

export const toUpperCaseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const formatEventTypePlaceholder = (eventType) => {
  const isTransfer = Object.keys(EVENT_TYPES)
     .some((category) => {
       return EVENT_TYPES[category]
         .includes(eventType) && category === `TRANSFERS`;
     });

  return isTransfer
    ? toUpperCaseFirstLetter(`${eventType} to`)
    : toUpperCaseFirstLetter(`${eventType} in`);
};

export const sortObject = (unsortedObject) => {
  const sortedObject = {};

  Object.keys(unsortedObject)
    .sort((a, b) => unsortedObject[b] - unsortedObject[a])
    .forEach((item) => {
      sortedObject[item] = unsortedObject[item];
    });

  return sortedObject;
};
