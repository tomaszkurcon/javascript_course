"use strict";

const funkcja_zwrotna = () => {
  const pole_tekstowe = document.forms[0].elements.pole_tekstowe.value;
  const pole_liczbowe = document.forms[0].elements.pole_liczbowe.value;
  let wynik = document.forms[0].elements.wynik;

  wynik.value = parseFloat(pole_tekstowe) + parseFloat(pole_liczbowe);
  console.log("wczytana wartość z pola tekstowego: ", typeof pole_tekstowe);
  console.log("wczytana wartość z pola liczbowego: ", typeof pole_liczbowe);
};
// window.prompt("Tekst1", "Tekst2");

const prompt_fn = () => {
  for (let i = 0; i < 4; i++) {
    const value = window.prompt();
    console.log("Wczytana wartość: ", typeof value);
  }
};
