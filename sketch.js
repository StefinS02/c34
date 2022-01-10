const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,rope1,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;

var bgSound, cutSound, sadSound, eatSound, airSound;
var blower;
var muteButton;

var star,starImg,star1Img,emptyStar,oneStar,twoStar;
var starScore;

var canW, canH;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  bgSound = loadSound("sound1.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  eatSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");

  starImg = loadImage('star.png');
  star1Img = loadImage('one_star.png');
  emptyStar = loadAnimation('empty.png');
  oneStar = loadAnimation('one_star.png');
  twoStar = loadAnimation('stars.png');

  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
  }
  createCanvas(canW,canH);
  frameRate(80);

  bgSound.play();
  bgSound.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(canW/4+50,30);
  button.size(60,60);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(canW/2 + 120,30);
  button2.size(60,60);
  button2.mouseClicked(drop2);

  //button3 = createImg('cut_btn.png');
  //button3.position(canW/2+200,130);
  //button3.size(60,60);
  
  blower = createImg('baloon2.png');
  blower.position(canW/2-100,canH/2-50);
  blower.size(100,150);
  blower.mouseClicked(airBlow);

  muteButton = createImg('mute.png');
  muteButton.position(canW-70,10);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);
  
  rope = new Rope(9,{x:canW/4+60,y:35});
  rope1 = new Rope(9,{x:canW/2+170,y:43});
  //rope2 = new Rope(7,{x:canW/2+230,y:130});
  ground = new Ground(canW/2,canH-20,canW,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  starScore = createSprite(100,50,30,30);
  starScore.scale = 0.2;
  starScore.addAnimation("empty",emptyStar);
  starScore.addAnimation("one", oneStar);
  starScore.addAnimation("two",twoStar);
  starScore.changeAnimation('empty');
  

  

  bunny = createSprite(canW/2+100,canH-100,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  star = createSprite(canW/2,50,30,30);
  star.addImage(starImg);
  star.scale = 0.02;

  star2 = createSprite(canW/4,canH/2-100,30,30);
  star2.addImage(starImg);
  star2.scale = 0.02;

  
  fruit = Bodies.circle(canW/2+50,canH/2+150,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope1,fruit);
  //fruit_con_3 = new Link(rope2,fruit);


  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,canW/2,canH/2,canW,canH);

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope1.show();
  //rope2.show();

  Engine.update(engine);
  ground.show();

  if(collide(fruit,bunny,80)==true)
  {
    bunny.changeAnimation('eating');
    eatSound.play();
  }
   
  if(fruit!=null && fruit.position.y>canH-50)
  {
     bunny.changeAnimation('crying');
     sadSound.play();
   }

  if(collide(fruit,star,20)==true){
    star.visible = false;
    starScore.changeAnimation('two');
    starScore.scale = 0.1;
  }

  if(collide(fruit,star2,20)==true){
    star2.visible = false;
    starScore.changeAnimation('one');
    starScore.scale = 0.1;
  }
   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
  cutSound.play();
}

function drop2()
{
  rope1.break();
  fruit_con_2.detach();
  fruit_con_2 = null;
  cutSound.play();
}

//function drop3()
//{
  //rope2.break();
  //fruit_con_3.detach();
  //fruit_con_3 = null;
  //cutSound.play();
//}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
              World.remove(engine.world,fruit);
          
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlow(){
  Matter.Body.applyForce(fruit,{x:0, y:0},{x:0,y:0.03});
  airSound.play();
}

function mute(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  }
  else{
    bgSound.play();
  }
}
