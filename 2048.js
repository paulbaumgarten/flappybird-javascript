// Breakout by P Baumgarten 2023.

const COLORS = {
    border: "#b4a89a",
    background: "#c9bbae",
    darkText: "#776e65",
    lightText: "#f9f6f2",
    "2": "#e6dcd2",
    "4": "#e6dac1",
    "8": "#e9ac72",
    "16": "#f58f5c",
    "32": "#f47566",
    "64": "#f0583e",
    "128": "#edce71",
    "254": "#edca62",
    "512": "#f0c652",
    "1024": "#f0c652",
    "2048": "#f0c652",
};
let game_running = false;
let block_size = 0; // assign a value in setup()
let points = 0;
let block_offset_x = 6;
let block_offset_y = 6;
let blocks = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
];
let blocks_used = 0;
let pressX = 0;
let pressY = 0;

function preload() { // Load all the media files
}

function setup() { // Automatically runs once when page has loaded
    if (windowWidth > windowHeight) { // Landscape orientation
        block_size = windowHeight/4 - 3;
        block_offset_x = 5 + windowWidth/2 - block_size*2;
    } else {  // Portrait orientation
        block_size = windowWidth/4 - 3;
        block_offset_y = 5 + windowHeight/2 - block_size*2;
    }
    createCanvas(windowWidth, windowHeight);
    frameRate(25);
}

function addBlock() {
    let blockToFill = Math.trunc(Math.random() * (16-blocks_used));
    console.log("line 52 adding block at ",blockToFill);
    let y=0;
    let x=0;
    let value = 2;
    if (Math.random() < 0.1) { value = 4; } // 10% probability that the new tile will be a 4
    for (let i=0; i<blockToFill; i++) {
        x += 1;
        if (x >= 4) { y += 1; x = 0; }
        console.log("line 59",blocks_used,blockToFill,y,x);
        if (blocks[y][x] != 0) { x += 1; }
        if (x >= 4) { y += 1; x = 0; }
    }
    blocks[y][x] = value;
    blocks_used += 1;
}

function play() { // Main game loop, runs 25 times a second
    background(40);
    // Draw blocks
    for (let y=0; y<4; y++) {
        for (let x=0; x<4; x++) {
            stroke(COLORS.border);
            strokeWeight(10);
            if (blocks[y][x] == 0) {
                fill(COLORS.background)
            } else {
                // console.log(75, String(blocks[y][x]), blocks);
                fill(COLORS[ String(blocks[y][x]) ])
            }
            rect(block_offset_x + x*block_size, block_offset_y + y*block_size, block_size, block_size);
            strokeWeight(0);
            if (blocks[y][x] <= 4) {
                fill(COLORS.darkText);
            } else {
                fill(COLORS.lightText);
            }
            if (blocks[y][x] > 0) {
                text(String(blocks[y][x]), block_offset_x + x*block_size + block_size/2, block_offset_y + y*block_size + block_size/2);
            }
        }
    }
    stroke(40);
}

function swipe(direction) {
    console.log("swipe()", direction)
    if (direction=="left") {
        for (let y=0; y<4; y++) {
            for (let x=0; x<3; x++) {
                if (blocks[y][x] == 0) {
                    let x2=x+1;
                    while ((x2 < 3) && (blocks[y][x2] == 0)) {
                        x2 += 1;
                    }
                    blocks[y][x] = blocks[y][x2];
                    blocks[y][x2] = 0;
                }
                if ((x < 3) && (blocks[y][x] == blocks[y][x+1])) {
                    blocks[y][x] += blocks[y][x+1];
                    blocks[y][x+1] = 0;
                }
            }
        }
    }
    if (direction=="right") {
        for (let y=0; y<4; y++) {
            for (let x=3; x>0; x--) {
                if (blocks[y][x] == 0) {
                    let x2=x-1;
                    while ((x2 > 0) && (blocks[y][x2] == 0)) {
                        x2 -= 1;
                    }
                    blocks[y][x] = blocks[y][x2];
                    blocks[y][x2] = 0;
                }
                if ((x > 0) && (blocks[y][x] == blocks[y][x-1])) {
                    blocks[y][x] += blocks[y][x-1];
                    blocks[y][x-1] = 0;
                }
            }
        }
    }

    addBlock();
}


function mousePressed() { // Called automatically once every mouse press
    pressX = mouseX;
    pressY = mouseY;
}

function mouseReleased() { // Called automatically once every mouse release
    let distanceX = pressX - mouseX;
    let distanceY = pressY - mouseY;
    if ((abs(distanceX) > abs(distanceY))) {
        console.log(145,distanceX);
        if (distanceX > 100) { // Swipe right
            swipe("left");
        } else if (distanceX < -100) { // Swipe left
            swipe("right");
        }
    } else {
        if (distanceY > 100) { // Swipe down
            swipe("down");
        } else if (distanceY < -100) { // Swipe up
            swipe("up");
        }
    }
}

function draw() {
    if (! game_running) {
        textAlign(CENTER, CENTER);
        textSize(40);
        background(COLORS.background);
        fill(20);
        text('2048', windowWidth/2, windowHeight/3);
        text('Click to start', windowWidth/2, windowHeight*5/6);
        if (mouseIsPressed) {
            game_running = true;
            blocks = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
            ];
            blocks_used = 0;
            addBlock();    
        } 
    } else {
        play();
    }
    text(points, windowWidth-40, 25);
}
