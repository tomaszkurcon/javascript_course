"use strict";
function sum(x, y) {
  return x + y;
}
function string_to_number(s) {
  return isNaN(parseInt(s)) ? 0 : parseInt(s);
}
// function sum_strings(a) {
//   let sum = 0;
//   for (const numberString of a) {
//     sum += string_to_number(numberString);
//   }
//   return sum;
// }
function sum_strings(a) {
  return Array.from(a).reduce((acc, val) => (acc += string_to_number(val)), 0);
}

// function digits(s) {
//   const result = [0, 0];
//   for (const numberString of s) {
//     const number = string_to_number(numberString);
//     number % 2 === 1 ? (result[0] += number) : (result[1] += number);
//   }
//   return result;
// }
function digits(s) {
  return Array.from(s)
    .map((el) => string_to_number(el))
    .reduce(
      (acc, val) => {
        val % 2 === 1 ? (acc[0] += val) : (acc[1] += val);
        return acc;
      },
      [0, 0]
    );
}

// function letters(s) {
//   const result = [0, 0];
//   for (const letter of s) {
//     if (letter.toUpperCase() !== letter.toLowerCase()) {
//       letter === letter.toUpperCase() ? (result[1] += 1) : (result[0] += 1);
//     }
//   }
//   return result;
// }

function letters(s) {
  return Array.from(s)
    .filter((val) => val.toUpperCase() !== val.toLowerCase())
    .reduce(
      (acc, val) => {
        val.toUpperCase() === val ? (acc[1] += 1) : (acc[0] += 1);
        return acc;
      },
      [0, 0]
    );
}


