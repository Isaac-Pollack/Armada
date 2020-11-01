let customFont, introSong, playBkg, uiPanel, shootingVideo, movementVideo;
let playButton, settingsButton, highscoreButton, buttonR, buttonG, buttonB, buttonY, percent = 0, defaultAnim;
let scrollY = 0, uisizeX, uisizeY, shipsizeX, shipsizeY, xConstrain, yConstrain, minutes, seconds, milliseconds, hsData, settingsData;
let ship, shipBlue, shipRed, shipGreen, enemyRed, enemyGreen, bullet, bulletIMG, maxRedEnemies = 8, maxGreenEnemies = 2, maxBullets = 20;

const LOADING_MENU = 0;
const MAIN_MENU = 1;
const PLAY = 2;
const HIGH_SCORE = 3;
const CONTROLS = 4;
const GAME_OVER = 5;
let currentScreen = LOADING_MENU; //Starting screen

//----------------------------------------------------------------- SCREEN STATES --------------------------------------------------

//Screen State Logic.
function screenStateSwitch() {
  switch (currentScreen) {
    case LOADING_MENU:
      drawLoadingScreen();
      break;
    case MAIN_MENU:
      drawMainMenuScreen();
      break;
    case PLAY:
      drawPlayScreen();
      break;
    case HIGH_SCORE:
      drawHighScoreScreen();
      break;
    case CONTROLS:
      drawControlsScreen();
      break;
    case GAME_OVER:
        drawGameOverScreen();
        break;
  }
}

function drawLoadingScreen() { //LOADING_MENU - 0
  background(playBkg);
  textFont(customFont);
  textSize(50);
  fill(0);
  image(uiPanel, 100, 25, 700, 650);
  loadingBar();
}

function drawMainMenuScreen() { //MAIN_MENU - 1
  background(playBkg);
  textFont(customFont);
  textSize(120);
  text('ARMADA', 350, 100);

  textSize(30);
  //Play
  drawSprite(playButton);
  text('PLAY', 445, 187.5);
  playButton.onMousePressed = function() { //Blank callback
    currentScreen = PLAY;
    menuButtons.removeSprites();
    ship = createSprite(width / 2, height * 0.9);
    ship.addImage(shipBlue);
    ship.setCollider("circle", 0, 0, 25);
    ship.maxSpeed = 6;
    ship.rotation -= 90;
    ship.friction = 0.03;
  }

  //High Scores
  drawSprite(highscoreButton);
  text('HIGH SCORES', 415, 342.5);
  highscoreButton.onMousePressed = function() {
    currentScreen = HIGH_SCORE;
    menuButtons.removeSprites();
  }

  //Controls
  drawSprite(controlsButton);
  text('CONTROLS', 430, 497.5);
  controlsButton.onMousePressed = function() {
    currentScreen = CONTROLS;
    menuButtons.removeSprites();
  }
}

function drawPlayScreen() { //PLAY - 2
  milliseconds = millis();
  milliseconds = 0;

  //Scrolling Background - 2 images that reset
  image(playBkg, 0, scrollY, width, height);
  image(playBkg, 0, scrollY - height, width, height);
  scrollY += 2.2;
  if(scrollY > height) {
    scrollY = 0;
  }
  //Draw calls
  drawSprite(ship);
  drawSprites(friendlyProjectiles);
  drawSprites(enemyProjectiles);
  drawSprites(redEnemies);
  drawSprites(greenEnemies);
  animation(defaultAnim, ship.position.x - 1.5, ship.position.y + 38);

  for(bullet of enemyProjectiles) { //Red Ship loops for movement and collision/removal.
    if(bullet.position.y > 725){
      bullet.remove();
    }
    if(ship.overlap(enemyProjectiles)) {
      currentScreen = GAME_OVER;
      setupMenuSprites();
      enemyProjectiles.removeSprites();
      friendlyProjectiles.removeSprites();
      redEnemies.removeSprites();
      greenEnemies.removeSprites();
    }
  }
  for(enemyGreen of greenEnemies) { //Red Ship loops for movement and collision/removal.
    enemyGreen.setVelocity(0, 3);
    if(enemyGreen.position.y > 725){
      enemyGreen.position.x = (random(50, 825));
      enemyGreen.position.y = -10;
    }
    if(enemyGreen.overlap(friendlyProjectiles)) {
      enemyGreen.remove();
    }
    if(enemyGreen.overlap(ship)) {
      currentScreen = GAME_OVER;
      setupMenuSprites();
      enemyProjectiles.removeSprites();
      friendlyProjectiles.removeSprites();
      redEnemies.removeSprites();
      greenEnemies.removeSprites();
    }
  }
  for(enemyRed of redEnemies) { //Red Ship loops for movement and removal.
    enemyRed.setVelocity(0, 4);
    if(enemyRed.position.y > 725){
      enemyRed.position.x = (random(50, 825));
      enemyRed.position.y = -10;
    }
    if(enemyRed.overlap(friendlyProjectiles)) {
      enemyRed.remove();
    }
    if(enemyRed.overlap(ship)) {
      currentScreen = GAME_OVER;
      setupMenuSprites();
      enemyProjectiles.removeSprites();
      friendlyProjectiles.removeSprites();
      redEnemies.removeSprites();
      greenEnemies.removeSprites();
    }
  }

  //Keeps score value above everything else
  textFont(customFont);
  textSize(30);
  fill('0');
  text('SURVIVED FOR :  ' + nf(millis() / 1000, 0, 2), 375, 50);
}

function drawHighScoreScreen() { //HIGH_SCORE - 3
  background(playBkg);
  textFont(customFont);
  textSize(50);
  fill(0);
  line(125, 125, 775, 125)
  image(uiPanel, 100, 25, 700, 650);
  text('HIGH SCORES', 375, 100);
  Ldata();
}

function drawControlsScreen() { //CONTROLS - 4
  background(playBkg);
  textFont(customFont);
  textSize(50);
  fill(0);
  image(uiPanel, 100, 25, 700, 650);
  text('CONTROLS', 390, 100);
  image(Wkey, 250, 200, 50, 50)
  image(Akey, 200, 255, 50, 50)
  image(Dkey, 300, 255, 50, 50)
  image(Skey, 250, 255, 50, 50)
  image(Spacekey, 215, 450, 125, 75)
  //Videos
  image(movementVideo, 500, 190, 150, 150);
  image(shootingVideo, 500, 415, 150, 150);
}

function drawGameOverScreen() { //GAME_OVER - 5
  background(playBkg);
  textFont(customFont);
  textSize(200);
  fill(0);
  image(uiPanel, 100, 25, 700, 650);
  text('GAME OVER', 175, 400);
  textSize(50);
  fill(0);
  fill(0, 100);
  text('PRESS ESC TO RETURN TO MENU', 250, 475);
}

//----------------------------------------------------------------- FUNCTIONS ------------------------------------------------------
function Ldata() {//Leaderboard JSON drawing function, it doesn't loop, i did it manually.
  textFont(customFont);
  textSize(40);
  fill(0);
  text(hsData.leaderboard[0].position + "        " + hsData.leaderboard[0].name + "        " + hsData.leaderboard[0].time + "s", 275, 175);
  text(hsData.leaderboard[1].position + "        " + hsData.leaderboard[1].name + "           " + hsData.leaderboard[1].time + "s", 275, 225);
  text(hsData.leaderboard[2].position + "        " + hsData.leaderboard[2].name + "        " + hsData.leaderboard[2].time + "s", 275, 275);
  text(hsData.leaderboard[3].position + "        " + hsData.leaderboard[3].name + "        " + hsData.leaderboard[3].time + "s", 275, 325);
  text(hsData.leaderboard[4].position + "        " + hsData.leaderboard[4].name + "       " + hsData.leaderboard[4].time + "s", 275, 375);
  text(hsData.leaderboard[5].position + "        " + hsData.leaderboard[5].name + "         " + hsData.leaderboard[5].time + "s", 275, 425);
  text(hsData.leaderboard[6].position + "        " + hsData.leaderboard[6].name + "      " + hsData.leaderboard[6].time + "s", 275, 475);
  text(hsData.leaderboard[7].position + "        " + hsData.leaderboard[7].name + "      " + hsData.leaderboard[7].time + "s", 275, 525);
  text(hsData.leaderboard[8].position + "        " + hsData.leaderboard[8].name + "          " + hsData.leaderboard[8].time + "s", 275, 575);
  text(hsData.leaderboard[9].position + "       " + hsData.leaderboard[9].name + "        " + hsData.leaderboard[9].time + "s", 275, 625);
}

function loadingBar() { //Loading counter on loading screen, will display next steps when fin.
  textAlign(CENTER)
  textFont(customFont);
  textSize(150);
  text("LOADING " + percent + "%", 450, 300);

  if(percent < 100) {
    percent++;
  }
  else {
    percent = 100;
  }

  if(percent == 100) {
    textSize(50);
    text('PRESS ESC TO BEGIN', 450, 450);
  }
}

function enemySpritesLoop() { //Enemy generation based on maxEnemy variables.
  if(greenEnemies.length < maxGreenEnemies && currentScreen == PLAY) {
    enemyGreen = createSprite(random(50, 825), -20);
    enemyGreen.addImage(shipGreen);
    enemyGreen.setCollider("circle", 0, 0, 25);
    enemyGreen.maxSpeed = 6;
    enemyGreen.rotation -= 360;
    enemyGreen.addToGroup(greenEnemies);
  }
  if(redEnemies.length < maxRedEnemies && currentScreen == PLAY) {
    enemyRed = createSprite(random(50, 825), -20);
    enemyRed.addImage(shipRed);
    enemyRed.setCollider("circle", 0, 0, 25);
    enemyRed.maxSpeed = 6;
    enemyRed.rotation -= 360;
    enemyRed.addToGroup(redEnemies);
  }
}

function enemySpriteShoot() { //Bullet generation tied to setInterval timer.
  if(currentScreen == PLAY) {
    for(enemyGreen of greenEnemies) {
      if (enemyGreen.position.y > 60) {
      bullet = createSprite(enemyGreen.position.x, enemyGreen.position.y, 5, 5);
      bullet.setDefaultCollider();
      bullet.setSpeed(-10 + enemyGreen.getSpeed(), ship.rotation);
      bullet.addToGroup(enemyProjectiles);
      }
    }
  }
}

function setupMenuSprites() {//One time setup of menu button sprites.
    //Play Button
    playButton = createSprite(462.5, height / 3);
    playButton.addImage(buttonB);
    playButton.setCollider("rectangle", 0, 0, 150, 150);
    playButton.addToGroup(menuButtons);
    //HighScore Button
    highscoreButton = createSprite(462.5, height / 1.8);
    highscoreButton.addImage(buttonB);
    highscoreButton.setCollider("rectangle", 0, 0, 150, 150);
    highscoreButton.addToGroup(menuButtons);
    //Controls Button
    controlsButton = createSprite(462.5, height / 1.285);
    controlsButton.addImage(buttonB);
    controlsButton.setCollider("rectangle", 0, 0, 150, 150);
    controlsButton.addToGroup(menuButtons);
}

function setupPlaySprites() {//One time setup of ship sprite.
  //Player Ship
  ship = createSprite(width / 2, height * 0.9);
  ship.addImage(shipBlue);
  ship.setCollider("circle", 0, 0, 25);
  ship.maxSpeed = 6;
  ship.rotation -= 90;
  ship.friction = 0.03;
  ship.addAnimation("default", defaultAnim);

  //Animation to-fit
  flame1.resize(32, 32);
  flame2.resize(32, 32);
  flame3.resize(32, 32);
  flame4.resize(32, 32);
  flame5.resize(32, 32);
  Spacekey.resize(75, 75);
}

function interactionStates() { //KEY EVENT TRIGGERS

  if (keyDown(27) && currentScreen != MAIN_MENU) { //ESC
    currentScreen = MAIN_MENU;
    setupMenuSprites();
    friendlyProjectiles.removeSprites();
    redEnemies.removeSprites();
    greenEnemies.removeSprites();
    enemyProjectiles.removeSprites();
  }
  //CONTROLS - SHIP
  if(keyDown('UP_ARROW') || (keyDown('w')) && currentScreen == PLAY) { //UP
    ship.position.y  = constrain(ship.position.y - 5, 60, height - 30);
  }
  if(keyDown('DOWN_ARROW') || (keyDown('s')) && currentScreen == PLAY) { //DOWN
    ship.position.y  = constrain(ship.position.y + 5, 60, height - 30);
  }
  if(keyDown('LEFT_ARROW') || (keyDown('a')) && currentScreen == PLAY) { //LEFT
    ship.position.x  = constrain(ship.position.x - 5, 30, width - 30);
  }
  if(keyDown('RIGHT_ARROW') || (keyDown('d')) && currentScreen == PLAY) { //RIGHT
    ship.position.x  = constrain(ship.position.x + 5, 30, width - 30);
  }
  if(keyDown('Space') && currentScreen == PLAY && friendlyProjectiles.length < maxBullets) {
    bullet = createSprite(ship.position.x, ship.position.y, 5, 5);
    bullet.setDefaultCollider();
    bullet.setSpeed(10 + ship.getSpeed(), ship.rotation);
    bullet.life = 67;
    bullet.addToGroup(friendlyProjectiles);
  }
}

//----------------------------------------------------------------- P5 Functions ------------------------------------------------------
function preload() {

  //  UI
  buttonB = loadImage('assets/ui/metalblue.png')
  uiPanel = loadImage('assets/ui/glasspanel.png')

  //  Misc
  playBkg = loadImage('assets/backgrounds/SpaceBackground.png')
  customFont = loadFont('assets/Silver.ttf');
  introSong = loadSound('assets/sounds/IntroSong.mp3');
  hsData = loadJSON('assets/highscores.json');

  //  Player/Enemies
  shipBlue = loadImage('assets/ships/PlayerShip.png');
  shipRed = loadImage('assets/ships/EnemyRed.png');
  shipGreen = loadImage('assets/ships/EnemyGreen.png');

  //  Animations
  flame1 = loadImage('assets/flame/1.png');
  flame2 = loadImage('assets/flame/2.png');
  flame3 = loadImage('assets/flame/3.png');
  flame4 = loadImage('assets/flame/4.png');
  flame5 = loadImage('assets/flame/5.png');
  defaultAnim = loadAnimation(flame1, flame2, flame3, flame4, flame5);

  //Controls - https://gerald-burke.itch.io/geralds-keys
  Wkey = loadImage('assets/controls/W-key.png');
  Akey = loadImage('assets/controls/A-key.png');
  Skey = loadImage('assets/controls/S-key.png');
  Dkey = loadImage('assets/controls/D-key.png');
  Spacekey = loadImage('assets/controls/Space-key.png');


  //Groups
  menuButtons = new Group();
  friendlyProjectiles = new Group();
  enemyProjectiles = new Group();
  redEnemies = new Group();
  greenEnemies = new Group();
}


function setup() {
  createCanvas(900, 700);
  buttonB.resize(150, 150);
  setupPlaySprites();
  setupMenuSprites();
  console.log(hsData);

  //Videos
  shootingVideo = createVideo('assets/videos/Shooting.mp4');
  shootingVideo.loop();
  shootingVideo.hide();
  movementVideo = createVideo('assets/videos/Movement.mp4');
  movementVideo.loop();
  movementVideo.hide();

  setInterval(enemySpritesLoop, 700);
  setInterval(enemySpriteShoot, 400);

  //introSong.play(); //TODO - set to play on main menu, not loading
}

function draw() {
  screenStateSwitch();
  interactionStates();

  if(currentScreen != MAIN_MENU) {
    introSong.stop();
  }
}