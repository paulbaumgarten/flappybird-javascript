// Breakout by P Baumgarten 2023.

const COLORS = ["#d95085", "#df4547", "#e56f38", "#e1b304", "#47bb3b", "#393ae0", "#844ce6", "#1dd7dc"];
let game_running = false;
const blocks = [
    [[0,0], [1,0], [2,0], [3,0]],
    [[0,1], [1,1], [2,1], [2,0]],
    [[0,0], [1,0], [2,0], [2,1]],
    [[0,0], [0,1], [1,1], [1,1]],
    [[1,0], [1,1], [0,1], [0,2]],
    [[0,0], [0,1], [0,2], [1,1]],
    [[0,0], [0,1], [1,1], [1,2]]
]
const blockColors = [
    "cyan",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "red"
]

let points = 0;
let current = [...blocks[0]]; // clone the array
let currentY = 3;
let currentX = 5;
let currentColor = blockColors[0];
let board = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

function preload() { // Load all the media files
}

function setup() { // Automatically runs once when page has loaded
    createCanvas(windowWidth, windowHeight);
    frameRate(25);
}

function rotate90(tetromino) {
    let cx = 1; // centre of rotation for x
    let cy = 1; // centre of rotation for y
    // rotate
    for (let i=0; i<tetromino.length; i++) {
        y = tetromino[i][0];
        x = tetromino[i][1];
        tetromino[i] = [cy-(x-cx), cx+(y-cy)]
    }
    // check still fully on the board
    return tetromino
}

function rotate270(tetromino) {
    let cx = 1; // centre of rotation for x
    let cy = 1; // centre of rotation for y
    for (let i=0; i<tetromino.length; i++) {
        y = tetromino[i][0];
        x = tetromino[i][1];
        tetromino[i] = [cy+(x-cx), cx-(y-cy)]
    }
    return tetromino
}

function ensureFit(tetromino) {
    let minx = 10;
    let maxx = 0;
    for (let i=0; i<tetromino.length; i++) {
        minx = min(minx, tetromino[i][1])
        maxx = max(maxx, tetromino[i][1])
    }
    if (minx < 0) {
        let diff = 0-minx;
        for (let i=0; i<tetromino.length; i++) {
            tetromino[i][1] = tetromino[i][1]+diff; // shift to the right
        }
    } else if (maxx > 10) {
        let diff = maxx-10;
        for (let i=0; i<tetromino.length; i++) {
            tetromino[i][1] = tetromino[i][1]-diff; // shift to the left
        }
    }
    return tetromino
}

function keyPressed() {
    if (keyCode === "Z") { // rotate clockwise
        current = rotate270(current);
        current = ensureFit(current);
    } else if (keyCode === "X") { // rotate anticlockwise
        current = rotate90(current);
        current = ensureFit(current);
    } else if (keyCode === DOWN_ARROW) { // push down and start next block
        console.log("Not implemented");
    }
}

function play() { // Main game loop, runs 25 times a second
    background(40);
    // Draw existing board
    blockw = min(50, windowWidth / 10);
    blockh = min(50, windowHeight / 20);
    strokeWeight(1)
    stroke(0)
    for (let y=0; y<20; y++) {
        for (let x=0; x<10; x++) {
            fill(board[y][x])
            rect(x*blockw, y*blockh, blockw, blockh); // x,y,w,h
        }
    }
    // If current tetromino is empty, pick a random piece and reset height
    if (current.length == 0) {
        let newblock = Math.trunc(random()*blocks.length); 
        current = [...blocks[newblock]];
        currentColor = blockColors[newblock];
        currentY = 0;
        currentX = 5;
    }
    // Draw current tetromino
    console.log(current)
    for (let i=0; i<current.length; i++) {
        console.log(i, current[i]);
        y = current[i][0];
        x = current[i][1];
        fill(currentColor);
        rect(x*blockw, y*blockh, blockw, blockh); // x,y,w,h
    }
    // If able to drop current tetromino down 1 block, do so
    // If unable to drop current tetromino down 1 block, game over
}

function mousePressed() { // Called automatically once every mouse press
    game_running = true;
}

function draw() {
    if (! game_running) {
        textAlign(CENTER, CENTER);
        textSize(40);
        background(40);
        fill(200);
        text('Tetris', windowWidth/2, windowHeight/3);
        text('Click to start', windowWidth/2, windowHeight*5/6);
    } else {
        play();
    }
    text(points, windowWidth-40, 25);
}
