
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlumeting;

var trees_x;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    
    lives = 4;

    startGame();
}

function startGame()
{
	floorPos_y = height * 3/4;
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    // Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
	// Initialise arrays of scenery objects.
    
    trees_x = [{x_pos:15, y_pos:0}, 
               {x_pos: 30, y_pos:0},
               {x_pos: 50, y_pos:0},
               {x_pos: 70, y_pos:0},
               {x_pos: 140, y_pos:0},
               {x_pos: 280, y_pos:0},
               {x_pos: 560, y_pos:0},
               {x_pos: 900, y_pos:0},
               {x_pos: 1300, y_pos:0},
               {x_pos: 1500, y_pos:0},
               {x_pos: 1800, y_pos:0},
               {x_pos: 2000, y_pos:0},
               {x_pos: 2210, y_pos:0},
               {x_pos: 2304, y_pos:0},
               {x_pos: 3400, y_pos:0},
               {x_pos: 3700, y_pos:0}];
    
    clouds = [{x_pos:20, y_pos: 100},
              {x_pos:40, y_pos:0},
              {x_pos:2000, y_pos:0},
              {x_pos:300, y_pos:0} ,
              {x_pos:510, y_pos:0},
              {x_pos:111, y_pos:0},
              {x_pos:1113,y_pos:0},
              {x_pos:960, y_pos:0},
              {x_pos:1600, y_pos:0},
              {x_pos:2310, y_pos:0},
              {x_pos:3000, y_pos:0}];
    
    mountains = [{x_pos:10}, 
                 {x_pos:50},
                 {x_pos:123},
                 {x_pos:377},
                 {x_pos:710},
                 {x_pos:1111},
                 {x_pos:2000},
                 {x_pos:2743},
                 {x_pos:3101}];
    
    
    canyons = [{x_pos:145, width: 100}, 
               {x_pos:657, width: 100}, 
               {x_pos:1270, width: 100},
               {x_pos:2300, width: 100}];
    
    collectables = [{x_pos: -150, y_pos: 360, size: 45, isFound:false},
                    {x_pos: 56, y_pos: 310, size: 45, isFound:false},
                    {x_pos: 385, y_pos: floorPos_y, size: 45, isFound:false},
                    {x_pos: 585, y_pos: floorPos_y, size: 45, isFound:false},
                    {x_pos: 1000, y_pos: floorPos_y, size: 45, isFound:false},
                    {x_pos: 1800, y_pos: floorPos_y, size: 45, isFound:false}];
    
    game_score = 0;
    
    flagpole = {x_pos: 3500,isReached: false}
    
    lives -= 1;
    
    platforms = [];
    
    platforms.push(createPlatform(0,floorPos_y - 70,100))
    platforms.push(createPlatform(280,floorPos_y - 100,100));
    platforms.push(createPlatform(1200,floorPos_y - 100,100)); 
    platforms.push(createPlatform(1800,floorPos_y - 100,100));
    
    enemies = [];
    enemies.push(new Enemy(0,floorPos_y,100));
    enemies.push(new Enemy(567,floorPos_y,100));
    enemies.push(new Enemy(917,floorPos_y,100));
    enemies.push(new Enemy(2100,floorPos_y,100));
    enemies.push(new Enemy(3000,floorPos_y,100));

    
}

function draw()
{
	background(29, 0, 57); // fill the night sky 

	noStroke();
	fill(0,76,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate (scrollPos,0);

	// Draw clouds.
    
    drawClouds();

	// Draw mountains.
    
    drawMountains();

	// Draw trees.
    
    drawTrees();

	// Draw canyons.
    
    for (var i = 0; i < canyons.length; i++)
    {
        //console.log(mouseX);
        drawCanyon(canyons[i]);
        
        checkCanyon(canyons[i]);

    };

	// Draw collectable items.
    
    for (var i = 0; i < collectables.length; i++)
    {
        checkCollectable(collectables[i]);
        if (collectables[i].isFound == false)
       
       {
            drawCollectable(collectables[i]);
            
       }
   
        
    };
    
    renderFlagpole();
    
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
    for (var i = 0; i < enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContact(gameChar_world_x, gameChar_y))
            {
                startGame();
                break;
            }
 
        }

    
    pop();

	// Draw game character.
	
	drawGameChar();
    
    //draw screen text
    
    fill(255);
    noStroke();
    
    textSize(14);
    text("score: " + game_score, 20, 20);
    
    text("Health Points: " + lives, 20, 40);
    
    if(flagpole.isReached != false)
        {
            text("Level complete ! Press space to continue.", 400, 288)
            return
        }
    
    if(flagpole.isReached != true)
        {
            checkFlagpole();
        }
    
    push();
    if(lives < 1)
        {
            fill(255,0,0);
            textSize(30);
            text("GAME OVER !", width/2 - 50, height/2 - 50)
            text("Press space to continue.", width/2 - 110, height/2)
            return
        }
    pop();
    
    //lives icon
    
    for (var i = 0; i < lives; i++)

    {
        noStroke();
        fill(255,162,173);
        ellipse(30 * i + 30, 58, 20, 20);
        fill(255,172,183);
        ellipse(30 * i + 30, 58, 15, 15);
    };

	// Logic to make the game character move or the background scroll.
    //gravity
    if(gameChar_y < floorPos_y)
        {
            var isContact = false;
            
            for(var i = 0; i < platforms.length; i++)
                {
                if(platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
                    {
                        isContact = true;
                        break;
                    }
                }
            
            if(isContact == false)
                {
                  gameChar_y = gameChar_y + 2.5;
                  isFalling = true;
                }
            else
                {
                    isFalling = false;
                }

        }
        else
        {
            isFalling = false;  
        }
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 4;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 4;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
        
	}
    
    if (gameChar_y > floorPos_y + 150 && lives > 0)

           {
                startGame();
           }

	// Logic to make the game character rise and fall.

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
if(flagpole.isReached && key == '32')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == '32')
    {
        returnToStart();
        return
    }
    
    //left
    if(keyCode == 37)
    {
        isLeft = true;
        //console.log("isLeft:" + isLeft);
    }
    
    //right
    if(keyCode == 39)
    {
     isRight = true;
     //console.log("isRight:" + isRight);
    }

    //jump up   
    if(keyCode == 32)
    {
        if(isFalling == false)
        {
            gameChar_y = gameChar_y - 100;
            jumpSound.play();
        }
    }
}

function keyReleased()
{
    if(keyCode == 37)
        {
            isLeft = false;
            //console.log("isLeft:" + isLeft);
        }

        if(keyCode == 39)
        {
            isRight = false;
            //console.log("isRight:" + isRight);
        }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
     if(isLeft && isFalling)
	{
		// add your jumping-left code
            
    fill(204, 0, 204)
    ellipse(gameChar_x - 2, gameChar_y - 60 , 25, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 13 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x - 19, gameChar_y - 45, 10, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x - 12, gameChar_y - 11, 10, 16)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
    fill(204, 0, 204)
    ellipse(gameChar_x - 2, gameChar_y - 60 , 25, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 13 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x + 17, gameChar_y - 50, 10, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x + 1, gameChar_y - 11, 10, 16)

	}
	else if(isLeft)
	{
		// add your walking left code
        
    fill(204, 0, 204)
    ellipse(gameChar_x - 2, gameChar_y - 60 , 25, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 13 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x - 11, gameChar_y - 30, 10, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x - 9, gameChar_y - 14, 10, 15)

	}
	else if(isRight)
	{
		// add your walking right code
    fill(204, 0, 204)
    ellipse(gameChar_x - 2, gameChar_y - 60 , 25, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 13 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x + 10, gameChar_y - 30, 10, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x - 5, gameChar_y - 14, 10, 15)

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
            
    fill(204, 0, 204)
    ellipse(gameChar_x, gameChar_y - 60 , 29, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 12 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x - 18, gameChar_y - 50, 12, 12)
    ellipse(gameChar_x + 18, gameChar_y - 50, 12, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x - 11, gameChar_y - 10, 10, 15)
    rect(gameChar_x + 2, gameChar_y - 10, 10, 15)
    
    

	}
	else
	{
		// add your standing front facing code
    fill(204, 0, 204)
    ellipse(gameChar_x - 2, gameChar_y - 60 , 29, 29)
    
    fill(220, 20, 60)
    rect(gameChar_x - 13 , gameChar_y - 47, 23, 33)
    
    fill(229, 204, 255)
    ellipse(gameChar_x - 11, gameChar_y - 30, 12, 12)
    ellipse(gameChar_x + 10, gameChar_y - 30, 12, 12)
    
    fill(204, 0, 204)
    rect(gameChar_x - 13, gameChar_y - 14, 10, 15)
    rect(gameChar_x, gameChar_y - 14, 10, 15)

        
        
	}
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
        noStroke();
        
        
        fill(255, 255 , 255)
    ellipse(clouds[i].x_pos + 217, clouds[i].y_pos + 97, 110, 90);
    ellipse(clouds[i].x_pos + 217, clouds[i].y_pos + 97, 150, 70);
        
        

    }
}

// Function to draw mountains objects.

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
    fill(153, 0, 76)
    triangle(mountains[i].x_pos, floorPos_y - 293, mountains[i].x_pos - 278, floorPos_y, mountains[i].x_pos + 258, floorPos_y);
    
    fill(255)
    triangle(mountains[i].x_pos, 139, mountains[i].x_pos - 77, 220, mountains[i].x_pos + 73, 220);
    
    }
}

// Function to draw trees objects.

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        
        fill(102, 51, 0)
    rect(trees_x[i].x_pos - 10, 347, 20, 85);
    
    fill(0,255,0)
    triangle(trees_x[i].x_pos, 280, trees_x [i].x_pos - 29, 369, trees_x [i].x_pos + 29, 369);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{

   fill(153,27,0)
    rect(t_canyon.x_pos + 80, 430, t_canyon.width - 75,200)
    
    fill (102,178,255)
    rect(t_canyon.x_pos + 105,430, t_canyon.width - 35,200) 
    
    fill(153,27,0)
    rect(t_canyon.x_pos + 150,430, t_canyon.width - 75,200) 
    
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{

    if (gameChar_world_x > t_canyon.x_pos + 60 && gameChar_world_x < t_canyon.x_pos + 40 + t_canyon.width && gameChar_y >= floorPos_y)
    {
          isPlummeting = true;
          gameChar_y += 15;
    }
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(255,205, 45);
    ellipse(t_collectable.x_pos, t_collectable.y_pos - (t_collectable.size/2), t_collectable.size, t_collectable.size);
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    
    if(d < 23 && t_collectable.isFound == false)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function renderFlagpole()
{
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    if(flagpole.isReached)
        {
            noStroke();
            fill(255,0,0)
            rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
        }
    else
        {
            noStroke();
            fill(255,0,0)
            rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        }
    pop();
}

function checkFlagpole()
{
    //console.log("check flagpole");
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 50)
        {
            flagpole.isReached = true;
        }
    
    
}

function createPlatform(x,y,length)
{
    
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        { 
         fill(255,255,0);
            stroke(0);
            rect(this.x,this.y,this.length, 20)
        },
        checkContact: function(gc_x, gc_y)
        {
        //checks when char is on platform
            
            if(gc_x > this.x && gc_x < this.x + this.length)
        {
             var d = this.y - gc_y;
            if(d >= 0 && d < 5)
        {
             return true;

        }
    }
            return false;
    }
}
    
    return p;
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        stroke(255);
        fill(0);
        ellipse(this.current_x, this.y - 25, 50);
        fill(255);
        ellipse(this.current_x - 5, this.y - 25, 5)
        ellipse(this.current_x + 5, this.y - 25, 5)
        
        line(this.current_x - 5, this.y - 13, this.current_x + 5, this.y - 13);
;    }
    this.update = function()
    {
        this.current_x += this.incr;
        
        if(this.current_x < this.x)
            {
                this.incr = 1;
            }
        else if(this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
    }
    
this.isContact = function(gc_x, gc_y)
{
   //if contact is made then this returns true 
    var d = dist(gc_x, gc_y, this.current_x, this.y);
    
    if(d < 25)
        {
            return true;
        }
    return false;
}
}


