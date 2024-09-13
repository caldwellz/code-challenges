/************************************
 * Misc numerical helpers           *
 ************************************
 * Copyright (C) 2024 Zach Caldwell *
 * All rights reserved.             *
 ************************************/

/** Return the mean average of the values from the beginning or end of an array.
 * @param {Array<Number>} input
 * @param {Number} [length] Positive selects from the beginning of the array, negative from the end. Defaults to the entire array.
 * @returns {Number} The mean average of the selected subset.
 */
export function subsetMeanAvg(input, length = Infinity) {
  const subset = length < 0 ? input.slice(length) : input.slice(0, length);
  const subsetSum = subset.reduce((accumulator, value) => accumulator + value);
  return subsetSum / subset.length;
}

/** Round a base-10 number to a given number of places after the decimal point.
 * @param {Number} input
 * @param {Number} [places] How many places after the decimal point to round to.
 * @param {Function} [clampFunc] A function to deal with the remainder. Defaults to Math.round
 * @returns {Number} The input rounded to the given number of decimal places.
 */
export function roundToPlaces(input, places = 1, clampFunc = Math.round) {
  const multiplier = Math.pow(10, places);
  return clampFunc(input * multiplier) / multiplier;
}
