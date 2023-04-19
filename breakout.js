// Breakout by P Baumgarten 2023.

const COLORS = ["#d95085", "#df4547", "#e56f38", "#e1b304", "#47bb3b", "#393ae0", "#844ce6", "#1dd7dc"];
let game_running = false;
let blocks = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
];
let points = 0;
let player = { x: 144, y: 400, dx: 0, dy: 0 }; // defaults until windowWidth available
let paddle = { x: 0, y: 500, width: 50, height: 10 }; // defaults until windowWidth available
let speed = 20;

function preload() { // Load all the media files
}

function setup() { // Automatically runs once when page has loaded
    player = { x: windowWidth*0.5, y: windowHeight*0.75, dx: 0, dy: 10 };
    paddle = { x: windowWidth*0.4, y: windowHeight-50, width: windowWidth*0.2, height: 20 }; // defaults until windowWidth available
    createCanvas(windowWidth, windowHeight);
    frameRate(25);
}

function play() { // Main game loop, runs 25 times a second
    background(40);
    // Move player - do first so calculations below take it into account
    player.x = player.x + player.dx;
    player.y = player.y + player.dy;
    // Draw blocks
    stroke(40);
    let blockWidth = windowWidth/13;
    let blockHeight = windowHeight/16;
    for (let y=0; y<blocks.length; y++) {
        fill(COLORS[y]);
        for (let x=0; x<blocks[y].length; x++) {
            let x1 = x*blockWidth;
            let y1 = y*blockHeight;
            let x2 = (x+1)*blockWidth;
            let y2 = (y+1)*blockHeight;
            if (blocks[y][x] > 0) {
                // Is the player colliding with this block?
                if ((player.x >= x1) && (player.x <= x2) && (player.y >= y1) && (player.y <= y2)) {
                    console.log("Colliding with block ",y,x);
                    blocks[y][x] = 0; // turn off block
                    points += 1;
                    if (player.x <= x1+5) { // bounce off left edge
                        player.dx = -abs(player.dx) // bounce the X direction
                    } else if (player.x >= x2-5) { // bounce off right edge
                        player.dx = abs(player.dx) // bounce the X direction
                    } else { // bounce vertical
                        player.dy = -player.dy; // bounce the Y direction\
                    }
                }
            }
            if (blocks[y][x] > 0) {
                rect(x1, y1, blockWidth, blockHeight, 5);
            }
        }
    }
    // Move & draw paddle
    paddle.x = mouseX - paddle.width/2;
    stroke(255);
    fill(128);
    rect(paddle.x, paddle.y, paddle.width, paddle.height);
    // Bounce off edge?
    if (player.x < 0) { // left edge
        player.x = 0;
        player.dx = abs(player.dx);
    }
    if (player.x > windowWidth) { // right edge
        player.x = windowWidth;
        player.dx = -abs(player.dx);
    }
    if (player.y < 0) { // top edge
        player.y = 0;
        player.dy = abs(player.dy);
    }
    if (player.y > windowHeight) {  // falling off the bottom... game over!
        game_running = false;
    }
    // Bounce off paddle?
    if ((player.y >= paddle.y) && (player.y <= paddle.y+paddle.height) && (player.x >= paddle.x) && (player.x <= paddle.x+paddle.width)) {
        // Let's break the laws of physics and use the position of the impact against the paddle to determine bounce angle away from the paddle
        // A little bit of trigonometry is extremely helpful here... you will learn about radians and the unit circle in IGCSE so don't worry too much about it for now
        distance_from_center = player.x - paddle.x - paddle.width/2;
        angle = Math.PI * (distance_from_center / (paddle.width/2)) * 80 / 180;
        player.dy = -speed * Math.cos(angle);
        player.dx = speed * Math.sin(angle);
    }
    // Draw player - do last so player is always visible (on top layer)
    stroke(255);
    fill(255);
    circle(player.x, player.y, 10);
}

function mousePressed() { // Called automatically once every mouse press
    if (! game_running) {
        game_running = true;
        player = { x: windowWidth*0.5, y: windowHeight*0.75, dx: 0, dy: 10 };
        paddle = { x: windowWidth*0.4, y: windowHeight-50, width: windowWidth*0.2, height: 20 }; 
    }    
}

function draw() {
    if (! game_running) {
        textAlign(CENTER, CENTER);
        textSize(40);
        background(40);
        fill(200);
        text('Breakout', windowWidth/2, windowHeight/3);
        text('Click to start', windowWidth/2, windowHeight*5/6);
    } else {
        play();
    }
    text(points, windowWidth-40, 25);
}
