import {EVENT_TYPES} from '../const.js';

export const getRandomBool = () => Math.random() > 0.5;

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

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

