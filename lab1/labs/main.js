"use strict"; // Nie wyłączaj trybu ścisłego
var canvas = document.getElementById("canvas"); // Tutaj jest użyty standard W3C DOM — będzie on tematem następnych ćwiczeń

const context = canvas.getContext("2d"); // Utworzenie obiektu 'CanvasRenderingContext2D'
// context.scale(0.2,0.2);
context.strokeStyle = "#FBA834";
context.globalCompositeOperation = "xor";
context.scale(0.15, 0.15); 
context.lineWidth = 25;

//circle
context.beginPath();
context.arc(150, 150, 40, 0, 2 * Math.PI, true);
context.stroke();
//rect1
context.fillStyle = "#FBA834";
context.fillRect(0, 0, 100, 100);
//rect2
context.fillStyle = "#333A73";
context.fillRect(50, 50, 100, 100);

context.save();
context.translate(150, 150);
//rect3
context.fillStyle = "#387ADF";
context.fillRect(0, 0, 100, 100);
//rect4
context.fillStyle = "#50C4ED";
context.fillRect(50, 50, 100, 100);

context.save();

context.translate(-150, -150);
context.globalCompositeOperation = "destination-over";
//border
context.lineWidth = 5;
context.beginPath();
context.moveTo(0, 0);
context.lineTo(0, 200);
context.moveTo(0, 0);
context.lineTo(200, 0);
context.stroke();
context.strokeStyle = "#50C4ED";
context.beginPath();
context.moveTo(300, 300);
context.lineTo(150, 300);
context.moveTo(300, 300);
context.lineTo(300, 150);
context.stroke();

