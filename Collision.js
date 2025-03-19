const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual 
const window_height = window.innerHeight;
const window_width = window.innerWidth;

const colors = ["#fbb7c7", "#fdd7c2", "#55cbcd", "#b5ead6", "#f2efc4"];

canvas.style.background = "#dfa0ef";

// Counter for clicked circles
let clickCounter = 0;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.clicked = false; // Track if the circle has been clicked
    this.clickTime = 0; // Track when the circle was clicked
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.clicked ? "#E947D1" : this.color; // Change color if clicked
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Move the circle downward
    this.posY += this.speed;

    // Remove the circle if it goes below the canvas or after being clicked for 0.5 seconds
    if (this.posY - this.radius > canvas.height || (this.clicked && Date.now() - this.clickTime > 100)) {
      const index = circles.indexOf(this);
      if (index > -1) {
        circles.splice(index, 1);
      }
    }
  }

  isClicked(mouseX, mouseY) {
    const dx = this.posX - mouseX;
    const dy = this.posY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }
}

// Crear un array para almacenar N círculos 
let circles = [];

// Función para generar un nuevo círculo en la parte superior del canvas
function generateCircle() {
  let radius = Math.random() * 40 + 20;
  let x = Math.random() * (canvas.width - radius * 2) + radius;
  let y = -radius; // Start above the canvas
  let color = colors[Math.floor(Math.random() * 5)]; // Color aleatorio 
  let speed = Math.random() * 3 + 5; // Velocidad entre 3 y 5 
  let text = `C${circles.length + 1}`; // Etiqueta del círculo 
  circles.push(new Circle(x, y, radius, color, text, speed));
}

// Función para animar los círculos 
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas 

  // Draw the counter
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Clicked: ${clickCounter}`, 70, 30);

  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo 
  });

  // Generate new circles at random intervals
  if (Math.random() < 0.02) { // Adjust the probability to control the frequency
    generateCircle();
  }

  requestAnimationFrame(animate); // Repetir la animación 
}

// Event listener for mouse clicks
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Iterate through circles in reverse order to handle overlapping circles
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].isClicked(mouseX, mouseY)) {
      if (!circles[i].clicked) { // Only process if the circle hasn't been clicked yet
        circles[i].clicked = true; // Mark the circle as clicked
        circles[i].clickTime = Date.now(); // Record the click time
        clickCounter++; // Increment the counter
      }
      break; // Exit the loop after handling the first clicked circle
    }
  }
});

// Generar un círculo inicial y comenzar la animación 
generateCircle();
animate();