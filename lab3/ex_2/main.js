"use strict";
const h1_tags = document.getElementsByTagName("h1");
const azure_background_elements = document.querySelectorAll(
  ".block-page-element"
);
const container = document.querySelector(".container-el");
const r = document.querySelector(":root");
const main = document.getElementById("main-section")
const set_button = document.getElementById("set-button")
const delete_button = document.getElementById("delete-button")
const add_button = document.getElementById("add-button")
let style = document.createElement("style");
document.head.appendChild(style);
let stylesheet = style.sheet;

const azure_background_elements_classes = [
  "azure",
  "border-with-shadow",
  "block-padding",
];
const text = ["Natenczas Wojski chwycił na taśmie przypięty Swój róg bawoli, długi, cętkowany, kręty Jak wąż boa, oburącz do ust go przycisnął, Wzdął policzki jak banię, w oczach krwią zabłysnął, Zasunął wpół powieki, wciągnął w głąb pół brzucha I do płuc wysłał z niego cały zapas ducha, I zagrał: róg jak wicher, wirowatym dechem Niesie w puszczę muzykę i podwaja echem.", " Umilkli strzelcy, stali szczwacze zadziwieni Mocą, czystością, dziwną harmoniją pieni. Starzec cały kunszt, którym niegdyś w lasach słynął, Jeszcze raz przed uszami myśliwców rozwinął; Napełnił wnet, ożywił knieje i dąbrowy, Jakby psiarnię w nie wpuścił i rozpoczął łowy.", "Bo w graniu była łowów historyja krótka: Zrazu odzew dźwięczący, rześki: to pobudka; Potem jęki po jękach skomlą: to psów granie; A gdzieniegdzie ton twardszy jak grzmot: to strzelanie."]



const addStyles = () => {
  for (const h1 of h1_tags) {
    h1.classList.add("title-animation");
  }
  for (const el of azure_background_elements) {
    el.classList.add(...azure_background_elements_classes);
  }
  container.classList.add("container");
  stylesheet.insertRule("* { margin: 0; }");
  stylesheet.insertRule("* { padding: 0; }");
  stylesheet.insertRule("* { box-sizing: border-box; }");

  r.style.setProperty("--text-color-initial", "black");
  r.style.setProperty("--text-color-final", "red");
};
const deleteStyles = () => {
  for (const h1 of h1_tags) {
    h1.classList.remove("title-animation");
  }
  for (const el of azure_background_elements) {
    el.classList.remove(...azure_background_elements_classes);
  }
  container.classList.remove("container");
  while (stylesheet.cssRules.length > 0) {
    stylesheet.deleteRule(0);
  }
  r.style.removeProperty("--text-color-initial");
  r.style.removeProperty("--text-color-final");
};

const addParagraph = () => {
    const paragraph = document.createElement("p");
    const textNode = document.createTextNode(text[main.childElementCount-1]);
    paragraph.appendChild(textNode);
    main.appendChild(paragraph);
    main.childElementCount-1 >= text.length ? add_button.disabled = true : add_button.disabled = false;   
};

set_button.addEventListener("click", addStyles)
delete_button.addEventListener("click", deleteStyles)
add_button.addEventListener("click", addParagraph)