const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual 
const window_height = window.innerHeight;
const window_width = window.innerWidth;

const colors = ["#fbb7c7", "#fdd7c2", "#55cbcd", "#b5ead6", "#f2efc4"];

canvas.style.background = "#dfa0ef";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;

    // New properties for collision color change
    this.collisionColor ='#F70BC0'; // Color to change to on collision
    this.collisionTime = 0; // Time when collision occurred
    this.collisionDuration = 100; // Duration to show collision color (500ms = 0.5s)
  }

  draw(context) {
    context.beginPath();

    // Change color if a collision occurred recently
    if (Date.now() - this.collisionTime < this.collisionDuration) {
      context.fillStyle = this.collisionColor;
    } else {
      context.fillStyle = this.color;
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);

    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
  }

  update(context, circles) {
    this.draw(context);

    // Actualizar la posición X 
    this.posX += this.dx;
    // Cambiar la dirección si el círculo llega al borde del canvas en X 
    if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Actualizar la posición Y 
    this.posY += this.dy;
    // Cambiar la dirección si el círculo llega al borde del canvas en Y 
    if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Check for collisions with other circles
    for (let other of circles) {
      if (this !== other && this.checkCollision(other)) {
        this.handleCollision(other);
      }
    }

    // Ensure the circle stays within canvas bounds after collision
    this.posX = Math.max(this.radius, Math.min(canvas.width - this.radius, this.posX));
    this.posY = Math.max(this.radius, Math.min(canvas.height - this.radius, this.posY));
  }

  checkCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  handleCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    
    // Calculate the minimum translation distance to separate the circles
    const minDistance = this.radius + other.radius;
    const overlap = minDistance - distance;

    const angle = Math.atan2(dy, dx);
    const tx = this.posX + (overlap / 2) * Math.cos(angle);
    const ty = this.posY + (overlap / 2) * Math.sin(angle);

    // Move the circles apart
    this.posX = tx;
    this.posY = ty;
    other.posX = other.posX - (overlap / 2) * Math.cos(angle);
    other.posY = other.posY - (overlap / 2) * Math.sin(angle);

    // Reverse directions
    const tempDx = this.dx;
    const tempDy = this.dy;
    this.dx = other.dx;
    this.dy = other.dy;
    other.dx = tempDx;
    other.dy = tempDy;

    // Set collision time for both circles
    this.collisionTime = Date.now();
    other.collisionTime = Date.now();
  }
}

// Crear un array para almacenar N círculos 
let circles = [];

// Función para generar círculos aleatorios 
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 40 + 20;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let color = colors[Math.floor(Math.random() * 5)]; // Color aleatorio 
    let speed = Math.random() * 2 + 3; // Velocidad entre 1 y 3 
    let text = `C${i + 1}`; // Etiqueta del círculo 
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// Función para animar los círculos 
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas 
  circles.forEach(circle => {
    circle.update(ctx, circles); // Actualizar cada círculo 
  });
  requestAnimationFrame(animate); // Repetir la animación 
}

// Generar N círculos y comenzar la animación 
generateCircles(10); // Puedes cambiar el número de círculos aquí 
animate();