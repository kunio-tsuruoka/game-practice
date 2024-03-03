const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isGameOver = false;

const player = {
  jumpHeight: 0,
  isJumping: false,
  x: canvas.width / 2,
  y: canvas.height - 10, // Adjusted to account for the player size
  size: 10,
  color: 'blue',
  hp: 5,
  rectWidth: 30, // Example width, adjust as necessary
  rectHeight: 50, // Example height, adjust as necessary
  circleRadius: 10, // Example radius, adjust as necessary
  speed: 5, // Define a speed for the player
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  move() {
    if (this.ArrowUp && this.y - (this.size + this.speed) >= 0) {
      this.y -= this.speed;
    }
    if (this.ArrowDown && this.y + (this.size + this.speed) <= canvas.height) {
      this.y += this.speed;
    }
    if (this.ArrowRight && this.x + (this.size + this.speed) <= canvas.width) {
      this.x += this.speed;
    }
    if (this.ArrowLeft && this.x - (this.size + this.speed) >= 0) {
      this.x -= this.speed;
    }
  },

  drawShapes() {
    const rectWidth = this.rectWidth;
    const rectHeight = this.rectHeight;
    // Adjust X and Y to draw the shapes around the player's current position
    const rectX = this.x - this.rectWidth / 2; // Center around the player's x position
    const rectY = this.y - this.jumpHeight - this.rectHeight; // Position above the player

    // Draw rectangle
    ctx.fillStyle = '#FFDEAD';
    ctx.beginPath();
    ctx.rect(rectX, rectY, rectWidth, rectHeight);
    ctx.stroke();
    ctx.fill();

    // Draw semi-circle on top of the rectangle
    ctx.fillStyle = '#F19012';
    ctx.beginPath();
    ctx.arc(rectX + rectWidth / 2, rectY, rectWidth / 2, Math.PI, 0, false);
    ctx.fill(); // セミサークルを塗りつぶし
    ctx.closePath();
    ctx.stroke();

    // Draw full circle below the rectangle
    const circleRadius = this.circleRadius;
    ctx.fillStyle = '#FFDEAD';
    ctx.beginPath();
    ctx.arc(
      rectX + rectWidth / 2,
      rectY + rectHeight + circleRadius,
      circleRadius,
      0,
      2 * Math.PI,
      false
    );

    // Draw circles at the rectangle's ends
    // Left circle
    ctx.beginPath();
    ctx.arc(
      rectX,
      rectY + 20 + rectHeight / 2,
      circleRadius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.stroke();

    // Right circle
    ctx.beginPath();
    ctx.arc(
      rectX + rectWidth,
      rectY + 20 + rectHeight / 2,
      circleRadius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.stroke();
  },
  jump() {
    if (this.isJumping) {
      // Jumping up
      this.jumpHeight += jumpSpeed;
      if (this.jumpHeight >= maxJumpHeight) {
        // Start falling
        this.isJumping = false;
      }
    } else {
      // Falling down
      if (this.jumpHeight > 0) {
        this.jumpHeight -= jumpSpeed;
      }
    }
  },
  draw() {
    ctx.fillStyle = this.color;
    // Draw the player at the new position
    ctx.fillRect(this.x, this.y - this.jumpHeight, this.size, this.size);
  },
};

function checkCollision(player, obstacle) {
  const playerTop = player.y - player.size - player.jumpHeight;
  const playerBottom = player.y - player.jumpHeight;
  const playerLeft = player.x;
  const playerRight = player.x + player.size;

  const obstacleTop = obstacle.y - obstacle.height;
  const obstacleBottom = obstacle.y;
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;

  return (
    playerBottom > obstacleTop &&
    playerTop < obstacleBottom &&
    playerRight > obstacleLeft &&
    playerLeft < obstacleRight
  );
}

class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ellipseCount = 20;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
  }

  drawEllipses() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const initialWidth = this.width / 2; // 初期幅
    const initialHeight = this.height / 2; // 初期高さ
    const widthIncrement = 4; // 幅の増加量
    const heightIncrement = widthIncrement / 1.5; // 高さの増加量（幅の増加量の2/3）

    for (let i = 0; i < this.ellipseCount; i++) {
      ctx.beginPath();
      let ellipseWidth = initialWidth + i * widthIncrement;
      let ellipseHeight = initialHeight + i * heightIncrement;
      ctx.ellipse(
        centerX,
        centerY,
        ellipseWidth,
        ellipseHeight,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }
}

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

function keydown(event) {
  if (event.keyCode == 38) {
    player.ArrowUp = true;
  }
  if (event.keyCode == 40) {
    player.ArrowDown = true;
  }
  if (event.keyCode == 39) {
    player.ArrowRight = true;
  }
  if (event.keyCode == 37) {
    player.ArrowLeft = true;
  }
}

function keyup(event) {
  if (event.keyCode == 38) {
    player.ArrowUp = false;
  }
  if (event.keyCode == 40) {
    player.ArrowDown = false;
  }
  if (event.keyCode == 39) {
    player.ArrowRight = false;
  }
  if (event.keyCode == 37) {
    player.ArrowLeft = false;
  }
}
// Listen for keydown events
// window.addEventListener('keydown', function(event) {
//     if (event.key === 'x' || event.key === 'X') {
//         // Start jumping if not already jumping and if on the ground
//         console.log('key down')
//         if (!player.isJumping && player.jumpHeight === 0) {
//             player.isJumping = true;
//         }
//     }
// });

const obstacle = new Obstacle(canvas.width, canvas.height - 10, 10, 10);

const update = () => {
  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // player.jump(); // Call jump every fxrame to handle both jumping and falling
    player.move();
    player.drawShapes();
    if (checkCollision(player, obstacle)) {
      isGameOver = true;
      alert('あなたの負け！');
    }
    /*       obstacle.draw();
        obstacle.update(); */
    requestAnimationFrame(update);

    // Continue the loop
  }
};

update(); // Start the game loop
