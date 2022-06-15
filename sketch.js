//variaveis continuas do gamestate
var PLAY = 1;
var END = 0;
var gameState = PLAY;
// variaveis: trex e chão
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameoverImg, restartImg;
var checkpoint, die, jump;
// variaveis do cenário
var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;
  var backgroundImg;
  var sun, sunImg;
//variavel da pontuação
var score;
//carregamento de imagens e animações
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  groundImage = loadImage("ground2.png");
  backgroundImg = loadImage("backgroundImg.png")
  cloudImage = loadImage("cloud.png");
  sunImg = loadImage("sun.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");


}
// criação/base do jogo
function setup() {
  createCanvas(windowWidth, windowHeight);
  var mensagem = "esta é uma mensagem"
console.log(mensagem)

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  gameover = createSprite(width/2,height/2- 50);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.5;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);

  score = 0;
  //trex.setCollider("rectangle",90,0,60, trex.height);
  //trex.debug = true;
  sun = createSprite(width-50,100,10,10);
  sun = addAnimation("sun", sunImg);
  sun.scale = 0.1;



}
// o corpo do jogo em si
function draw() {
  background(backgroundImg);
  //exibindo pontuacão
  textSize(20);
  fill("black");
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    //mover o solo
    ground.velocityX = -(4 + 3*score/100);
    //pontuação
    score = score + Math.round(frameCount /60);
    gameover.visible = false;
    restart.visible = false;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //pular quando a tecla de espaço for pressionada
    if(touches.length>0 || keyDown("SPACE")) {
      reset();
      touches = []
    }
  
   if(score > 0 && score% 200 === 0){
   checkpoint.play();

   }
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8;
    trex.changeAnimation("running", trex_running);
    //gere as nuvens
    spawnClouds();

    //gere obstáculos no solo
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      die.play();
      gameState = END;
      //trex.velocityY = -12;
      //jump.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    gameover.visible = true;
    restart.visible = true;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    if (mousePressedOver(restart)){
     reset();
     
    }



  }

  //impedir que o trex caia
  trex.collide(invisibleGround);

  drawSprites();
}
// criação e spawn de obstaculos
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.velocityX = -(6 + score/100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //atribuir escala e vida útil ao obstáculo
    obstacle.scale = 0.5;
   // obstacle.lifetime = 300;


    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}
//criação e spwan de nuvens
function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage)
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribuir vida útil à variável
   // cloud.lifetime = 134;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicionando nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}
function reset() {
gameState = PLAY;
gameover.visible = false;
restart.visible = false;
cloudsGroup.destroyEach();
obstaclesGroup.destroyEach();
score = 0;
}