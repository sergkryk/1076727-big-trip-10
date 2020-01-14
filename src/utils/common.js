import {EVENT_TYPES} from '../const.js';

const getRandomBool = () => Math.random() > 0.5;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

const toUpperCaseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const formatEventTypePlaceholder = (eventType) => {
  const isTransfer = Object.keys(EVENT_TYPES)
     .some((category) => {
       return EVENT_TYPES[category]
         .includes(eventType) && category === `TRANSFERS`;
     });

  return isTransfer
    ? toUpperCaseFirstLetter(`${eventType} to`)
    : toUpperCaseFirstLetter(`${eventType} in`);
};

export {
  getRandomBool,
  getRandomIntegerNumber,
  getRandomArrayItem,
  shuffleArray,
  toUpperCaseFirstLetter,
  formatEventTypePlaceholder
};

