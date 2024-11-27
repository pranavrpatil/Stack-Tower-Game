let canvas = document.getElementById("myCanvas");
let gameOverText = document.querySelector('.gameOverText');
let scoreNumber = document.querySelector('#scoreNumber');
let context = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 450;
canvas.height = 600;

// Game variables
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 40;
let boxes = [];
boxes[0] = {
    x: 100, // Start in the middle
    y: 300,
    width: 200
};
let debris = {
    x: 0,
    width: 0
};

// Create a new box
function newBox() {
    boxes[current] = {
        x: canvas.width / 2 - boxes[current - 1].width / 2, // Center the new box
        y: (current + 10) * height,
        width: boxes[current - 1].width
    };
}

// Handle game over
function gameOver() {
    mode = 'gameOver';
    gameOverText.style.display = 'block';
}

// Animation loop
function animate() {
    if (mode !== 'gameOver') {
        context.clearRect(0, 0, canvas.width, canvas.height);
        scoreNumber.innerHTML = current - 1;

        for (let n = 0; n < boxes.length; n++) {
            let box = boxes[n];
            context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
            context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
        }

        context.fillStyle = 'yellow';
        context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);

        if (mode === 'bounce') {
            boxes[current].x += xSpeed;
            if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width) xSpeed = -xSpeed;
            if (xSpeed < 0 && boxes[current].x < 0) xSpeed = -xSpeed;
        }

        if (mode === 'fall') {
            boxes[current].y -= ySpeed;

            if (boxes[current].y === boxes[current - 1].y + height) {
                mode = 'bounce';
                let difference = boxes[current].x - boxes[current - 1].x;
                if (Math.abs(difference) >= boxes[current].width) gameOver();

                debris = { y: boxes[current].y, width: difference };

                if (boxes[current].x > boxes[current - 1].x) {
                    boxes[current].width -= difference;
                    debris.x = boxes[current].x + boxes[current].width;
                } else {
                    debris.x = boxes[current].x - difference;
                    boxes[current].width += difference;
                    boxes[current].x = boxes[current - 1].x;
                }

                xSpeed += xSpeed > 0 ? 1 : -1;
                current++;
                scrollCounter = height;
                newBox();
            }
        }

        debris.y -= ySpeed;

        if (scrollCounter) {
            cameraY++;
            scrollCounter--;
        }
    }

    window.requestAnimationFrame(animate);
}

// Restart game
function restart() {
    gameOverText.style.display = 'none';
    boxes.splice(1, boxes.length - 1);
    mode = 'bounce';
    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    newBox();
    debris.y = 0;
}

// Handle user interaction
canvas.onpointerdown = function () {
    if (mode === 'gameOver') restart();
    else if (mode === 'bounce') mode = 'fall';
};

// Initialize game
restart();
animate();
