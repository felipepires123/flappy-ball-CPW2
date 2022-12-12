const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');
const img = new Image();
var fundo = new Audio();
const ponto = new Audio();
img.src = "/img/flappy-ball-set.png";
fundo.src = "/sound/Som de torcida som de estadio efeito sonoro - Cheering sound stadium sound sound effect.mp3"
ponto.src = "/sound/PONTO.mp3"
//////////////////////////////////////
//nivel de dificuldade
function facil(){
  gravity = .4;
  speed = 4.5;
  jump = -10.5;
  traveGap = 300;
}
function medio(){
  gravity = .5;
  speed = 6.2;
  jump = -11.5;
  traveGap = 238;
}
function dificil(){
  gravity = .6;
  speed = 8.3;
  jump = -8.5;
  traveGap = 200;
}

//função para mutar o som da torcida
function muteSom(){
  let buttomtxt = document.getElementById("som");
  
  if (buttomtxt.textContent == "SOM: on"){
    fundo.pause();
    buttomtxt.innerText= "SOM: off";
  }else{
    fundo.play(Infinity);
    buttomtxt.innerText = "SOM: on"
  }
  
}

// carrega o jogo
function load() {
}

// ajustes gerais
let gamePlaying = false;
let gravity = .5;
let speed = 6.2;
const size = [36, 36];
let jump = -11.5;
const cTenth = (tela.width / 10);
////////////////////////////////////////////////////
// Melhor pontuação em cada dificuldade
let bestScoreF = localStorage.getItem('bestScoreF'),
    bestScoreM = localStorage.getItem('bestScoreM'),
    bestScoreD = localStorage.getItem('bestScoreD');

let index = 0,
    flight, 
    flyHeight, 
    currentScore, 
    trave;

// opções das traves

const traveWidth = 78;
var traveGap = 238
const traveLoc = () => (Math.random() * ((tela.height - (traveGap + traveWidth)) - traveWidth)) + traveWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set inicial do voo (no meio da tela - a bola)
  flyHeight = (tela.height / 2) - (size[1] / 2);

  // setup das 3 primeiras traves
  traves = Array(3).fill().map((a, i) => [tela.width + (i * (traveGap + traveWidth)), traveLoc()]);
}

const render = () => {
  // fazer as traves enquanto não bater 
  index++;

  // ctx.clearRect(0, 0, tela.width, tela.);

  // peimeira parte do sprite do fundo
  ctx.drawImage(img, 0, 150, tela.width, tela.height, -((index * (speed / 2)) % tela.width) + tela.width, 0, tela.width, tela.height);
  // segunda parte do sprite do fundo
  ctx.drawImage(img, 0, 150, tela.width, tela.height, -(index * (speed / 2)) % tela.width, 0, tela.width, tela.height);
  
  // display da trave
  if (gamePlaying){
    traves.map(trave => {
      // movimento da trave
      trave[0] -= speed;

      // topo da trave
      ctx.drawImage(img, 432, 588 - trave[1], traveWidth, trave[1], trave[0], 0, traveWidth, trave[1]);
      // baixo da trave
      ctx.drawImage(img, 432 + traveWidth, 108, traveWidth, tela.height - trave[1] + traveGap, trave[0], trave[1] + traveGap, traveWidth, tela.height - trave[1] + traveGap);

      // Se tiver um ponto cria uma trave e aumenta o score de uso
      if(trave[0] <= -traveWidth){
        currentScore++;
        ponto.play();

        /////////////////////////////////////////////////
        // Checar se é o maior score em cada dificuldade
        switch (speed){
          //facil
          case 4.5:
            bestScoreF = Math.max(bestScoreF, currentScore);
            localStorage.setItem('bestScoreF', bestScoreF);
            break;
          //medio
          case 6.2: 
            bestScoreM = Math.max(bestScoreM, currentScore);
            localStorage.setItem('bestScoreM', bestScoreM);
            break;
          //dificil
          case 8.3:
            bestScoreD = Math.max(bestScoreD, currentScore);
            localStorage.setItem('bestScoreD', bestScoreD);
            break;
        }
        
        // Remover e criar nova trave
        traves = [...traves.slice(1), [traves[traves.length-1][0] + traveGap + traveWidth, traveLoc()]];
        
      }
    
      // Se bater na trave perde
      if ([
        trave[0] <= cTenth + size[0], 
        trave[0] + traveWidth >= cTenth, 
        trave[1] > flyHeight || trave[1] + traveGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // desenhar a bola
  if (gamePlaying) {
    ctx.drawImage(img, 438, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, tela.height - size[1]);
  } else {
    ctx.drawImage(img, 438, Math.floor((index % 9) / 3) * size[1], ...size, ((tela.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (tela.height / 2) - (size[1] / 2);
      // Texto de explicação  
    ctx.fillText('Clique para iniciar', 50, 100);
    ctx.font = "bold 30px courier";
  }

  //Mostra o placar em cada dificuldade 
  document.getElementById('bestScoreF').innerHTML = `Melhor facil: ${localStorage.getItem('bestScoreF')}`;
  document.getElementById('bestScoreM').innerHTML = `Melhor médio: ${localStorage.getItem('bestScoreM')}`;
  document.getElementById('bestScoreD').innerHTML = `Melhor dificil: ${localStorage.getItem('bestScoreD')}`;

  document.getElementById('currentScore').innerHTML = `Gols no jogo: ${currentScore}`;

  // diz ao navegador para executar animação da bola
  window.requestAnimationFrame(render);
}

// configuração de inicio
setup();
img.onload = render;
fundo.play(Infinity);

// começa o jogo
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
