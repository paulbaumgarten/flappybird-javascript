let BACKGROUND, BASE, BOTTOM_PIPE, TOP_PIPE, BIRD, DIE, HIT, WING, SWOOSH, FONT;
let game_size = [288, 512];
let bird = [50, 250];
let pipe = [300, 100];
let bird_frame_number = 0;
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
    TOP_PIPE = loadImage("media/pipe-top.png");
    BIRD = loadImage("media/flappybird-animation.gif");
    DIE = loadSound("media/die.mp3");
    HIT = loadSound("media/hit.mp3");
    WING = loadSound("media/wing.mp3");
    SWOOSH = loadSound("media/swoosh.mp3");
    FONT = loadFont('media/Roboto-Light.ttf');
}

function setup() {
    createCanvas(displayWidth, displayHeight);
    frameRate(25);
}

function is_collision(x1,y1,w1,h1,x2,y2,w2,h2) {
    // Useful tip: https://stackoverflow.com/a/56523797
    if ((x1 < x2+w2) && (x2 < x1+w1)) {
        if ((y1 < y2+h2) && (y2 < y1+h1)) {
            return true;
        }
    }
    return false;
}
  
function play() {
    // One frame of the game
    // Process user interactions (keyboard, mouse, screen tap)
    if (mouseIsPressed) {
        jump = 20;
        WING.play();
    }
    bird[1] -= jump;
    if (jump > -20) {
        jump -= 2;
    }
    // Pipes
    pipe[0] -= pipe_speed;
    if (pipe[0] < -BOTTOM_PIPE.width) {
        pipe[0] = game_size[0];
        pipe[1] = 50 + random(game_size[1]-200);
        pipe_gap = 100 + random(100);
    }
    image(TOP_PIPE, pipe[0], pipe[1]-TOP_PIPE.height);
    image(BOTTOM_PIPE, pipe[0], pipe[1]+pipe_gap);
    // Bird
    let bird_frame = BIRD.setFrame(bird_frame_number); // Create a graphics object 34x24 pixels
    image(BIRD, bird[0], bird[1]);
    bird_frame_number = (bird_frame_number+1) % 3;
    // Detect collision
    if (is_collision(bird[0], bird[1], BIRD.width, BIRD.height, 
            pipe[0], pipe[1]-TOP_PIPE.height, TOP_PIPE.width, TOP_PIPE.height) ||
        is_collision(bird[0], bird[1], BIRD.width, BIRD.height, 
            pipe[0], pipe[1]+pipe_gap, BOTTOM_PIPE.width, BOTTOM_PIPE.height) ) {
        lives -= 1;
        bird = [50, 250];
        pipe[0] = game_size[0] + pipe_speed*25;
        pipe[1] = 50 + random(game_size[1]-200);
        pipe_gap = 100 + random(100);
        if (lives < 0) {
            game_running = false;
            DIE.play();
        } else {
            HIT.play();
        }
    }
    // Print lives remaining
    textAlign(CENTER, CENTER); // horizontal, vertical
    textSize(40);
    fill(255);
    text(lives, 10, 10);
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
    background('rgba(0,255,0, 0.25)');
    image(BACKGROUND, 0, 0); // for cropping https://p5js.org/reference/#/p5/get
    image(BASE, 0, game_size[1]-BASE.height);
    if (game_running) {
        // Game is happening!
        play();
    } else {
        // Game over or not started for the first time
        wait_to_start();
    }
}

