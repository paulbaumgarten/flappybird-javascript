let BACKGROUND, BASE, BOTTOM_PIPE, TOP_PIPE, BIRD, DIE, HIT, WING, SWOOSH, FONT;
let game_size = [288, 512];
let bird = [50, 250];
let pipe = [300, 100];
let bird_frame = 0;
let jump = 0;
let lives = 5;
let pipe_gap = 100;
let pipe_speed = 10;
let game_running = false;
let flap = false;

function preload() {
    // Load media files
    BACKGROUND = loadImage('media/background.png');
    BASE = loadImage("media/base.png");
    BOTTOM_PIPE = loadImage("media/pipe.png");
    BIRD = loadImage("media/flappybird-animation.png");
    DIE = loadSound("media/die.wav");
    HIT = loadSound("media/hit.wav");
    WING = loadSound("media/wing.wav");
    SWOOSH = loadSound("media/swoosh.wav");
    FONT = loadFont('media/Roboto-Light.ttf');
}

function setup() {
    createCanvas(displayWidth, displayHeight);
    background('rgba(0,255,0, 0.25)');
}
  
function play() {
    // One frame of the game
    // Pipes
    // Bird
    // Collision
    textAlign(CENTER, CENTER); // horizontal, vertical
    textSize(40);
    fill(255);
    text('Running', game_size[0]/2, game_size[1]/6);
}

function wait_to_start() {
    textAlign(CENTER, CENTER); // horizontal, vertical
    textSize(40);
    fill(255);
    text('Flappy bird', game_size[0]/2, game_size[1]/3);
    textSize(20);
    text('Click to start', game_size[0]/2, game_size[1]*5/6);
    if (mouseIsPressed) {
        //fullScreen(true);
        game_running = true;
    }
}

function draw() {
    // Paint background
    image(BACKGROUND, 0, 0); // for cropping https://p5js.org/reference/#/p5/get
    if (game_running) {
        // Game is happening!
        play();
    } else {
        // Game over or not started for the first time
        wait_to_start();
    }
}

