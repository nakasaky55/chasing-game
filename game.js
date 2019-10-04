/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;
let time = 0;
let score = 0;
let isGameOver = false;
let isAdded = false;

let displayHighestScore = getAppState().hightScore.score;
document.getElementById("highest-score").innerHTML = displayHighestScore;

function getAppState() {
  return (
    JSON.parse(localStorage.getItem("data")) || {
      isGameOver: false,
      hightScore: {
        user: "",
        score: 0
      },
      playSession: []
    }
  );
}

function saveAppState(appstate) {
  return localStorage.setItem("data", JSON.stringify(appstate));
}

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.getElementById("gamePanel").appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let slashone, slashtwo, slashthree, slashfour;
let dieone, dietwo, diethree, diefour, diefive, diesix;

let startTime = Date.now();
const SECONDS_PER_ROUND = 10;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/adventurer-right.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";

  slashone = new Image();
  slashone.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  slashone.src = "images/slash1.png";

  slashtwo = new Image();
  slashtwo.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  slashtwo.src = "images/slash2.png";

  slashthree = new Image();
  slashthree.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  slashthree.src = "images/slash3.png";

  slashfour = new Image();
  slashfour.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  slashfour.src = "images/slash4.png";

  slashfive = new Image();
  slashfive.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  slashfive.src = "images/slash5.png";

  //die animation
  dieone = new Image();
  dieone.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  dieone.src = "images/adventurer-die-01.png";
    
  dietwo = new Image();
  dietwo.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  dietwo.src = "images/adventurer-die-02.png";

  diethree = new Image();
  diethree.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  diethree.src = "images/adventurer-die-03.png";

  diefour = new Image();
  diefour.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  diefour.src = "images/adventurer-die-04.png";

  diefive = new Image();
  diefive.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  diefive.src = "images/adventurer-die-05.png";

  diesix = new Image();
  diesix.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  diesix.src = "images/adventurer-die-06.png";


}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
let monsterY = Math.floor(Math.random() * (canvas.height - 5));

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
  // Update the time.
  if (isGameOver == false) {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  }

  if (elapsedTime > SECONDS_PER_ROUND) {
    isGameOver = true;
  }

  if (isGameOver) {
    if (!isAdded) {
      die_model();
      saveAndUpdateHighestScore();
    }
    return;
  }
  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
    monsterY -= 1;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
    monsterY += 2;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
    monsterX -= 1;
    // heroImage.src = "images/adventurer-left.png";
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
    monsterX += 1;
    // heroImage.src = "images/adventurer-right.png";
  }

  //when hero moves to left
  if (heroX < 0) {
    heroX = 0;
  }

  //when hero moves the edge of right side
  if (heroX >= canvas.width - 20) {
    heroX = canvas.width - 20;
  }

  //when hero moves up to the top
  if (heroY < 10) {
    heroY = 10;
  }

  //when hero moves down to the bottom
  if (heroY >= canvas.height) {
    heroY = canvas.height - 5;
    // console.log(heroY);
  }

  //when hero moves to left
  if (monsterX < 0) {
    monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
    monsterY = Math.floor(Math.random() * (canvas.height - 5));
  }

  //when hero moves the edge of right side
  if (monsterX >= canvas.width) {
    monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
    monsterY = Math.floor(Math.random() * (canvas.height - 5));
  }

  //when hero moves up to the top
  if (monsterY < 10) {
    monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
    monsterY = Math.floor(Math.random() * (canvas.height - 5));
  }

  //when hero moves down to the bottom
  if (monsterY > canvas.height) {
    monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
    monsterY = Math.floor(Math.random() * (canvas.height - 5));
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32
  ) {
    score += 1;
    document.getElementById("your-score").innerHTML = score;
    if (attack_model()) {
      monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
      monsterY = Math.floor(Math.random() * (canvas.height - 5));
    }

    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (SECONDS_PER_ROUND - elapsedTime > 0) {
    ctx.fillText(
      `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
      20,
      100
    );
  } else {
    ctx.fillText(`GAME OVER`, 200, 250);
  }
};

function attack_model() {
  setTimeout(slash_one, 100);
  setTimeout(slash_two, 200);
  setTimeout(slash_three, 300);
  setTimeout(slash_four, 400);
  setTimeout(slash_five, 500);
  setTimeout(resetModel, 600);

  return true;
}

function slash_one() {
  heroImage = slashone;
}
function slash_two() {
  heroImage = slashtwo;
}
function slash_three() {
  heroImage = slashthree;
}
function slash_four() {
  heroImage = slashfour;
}
function slash_five() {
  heroImage = slashfive;
}

function resetModel() {
  heroImage.src = "images/adventurer-right.png";
}

// die animation
function die_model() {
  setTimeout(die_stand_one, 100);
  setTimeout(die_stand_two, 200);
  setTimeout(die_stand_three, 300);
  setTimeout(die_stand_four, 400);
  setTimeout(die_stand_five, 500);
  setTimeout(die_stand_six, 600);

  return true;
}

function stand_up_model() {
  setTimeout(die_stand_five, 100);
  setTimeout(die_stand_four, 200);
  setTimeout(die_stand_three, 300);
  setTimeout(die_stand_two, 400);
  setTimeout(die_stand_one, 500);
  setTimeout(resetModel, 600);
}

function die_stand_one() {
  heroImage = dieone;
}
function die_stand_two() {
  heroImage = dietwo;
}
function die_stand_three() {
  heroImage = diethree;
}
function die_stand_four() {
  heroImage = diefour;
}
function die_stand_five() {
  heroImage = diefive;
}
function die_stand_six() {
  heroImage = diesix;
}

function saveAndUpdateHighestScore() {
  let manageData = getAppState();
  let highestScore = manageData.hightScore.score;
  console.log(highestScore);
  if (score > highestScore) {
    manageData.hightScore.score = score;
    document.getElementById("highest-score").innerHTML = score;
  } else {
    document.getElementById("highest-score").innerHTML = highestScore;
  }
  let obj = new Object();
  obj.user = "Khoa";
  obj.score = score;
  manageData.playSession.push(obj);
  saveAppState(manageData);
  console.log("run");
  isAdded = true;
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

function restartGame(moment) {
  score = 0;
  isGameOver = false;
  isAdded = false;
  startTime = Date.now();
  elapsedTime = 0;
  stand_up_model();
  monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 10;
  monsterY = Math.floor(Math.random() * (canvas.height - 5));
  // ctx.fillText(
  //   `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
  //   20,
  //   100
  // );
  // console.log(applicationState);
  update();
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
function linkStart() {
  loadImages();
  setupKeyboardListeners();
  main();
  // console.log("run");
}

linkStart();
