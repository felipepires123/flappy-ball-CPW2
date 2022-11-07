const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');
const img = new Image();
const fundo = new Audio();
const ponto = new Audio();
img.src = "/img/flappy-ball-set.png";
fundo.src = "/sound/Som de torcida som de estadio efeito sonoro - Cheering sound stadium sound sound effect.mp3"
ponto.src = "/sound/PONTO.mp3"

//nivel de dificuldade
function facil(){
  gravity = .4;
  speed = 4.5;
  jump = -10.5;
}
function medio(){
  gravity = .5;
  speed = 6.2;
  jump = -11.5;
}
function dificil(){
  gravity = .6;
  speed = 8.3;
  jump = -8.5;
}

// ajustes gerais
let gamePlaying = false;
let gravity = .5;
let speed = 6.2;
const size = [36, 36];
let jump = -11.5;
const cTenth = (tela.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    trave;

// opções das traves
const traveWidth = 78;
const traveGap = 270;
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
  // fazer as traves enquanto 
  index++;

  // ctx.clearRect(0, 0, tela.width, tela.);

  // background first part 
  ctx.drawImage(img, 0, 0, tela.width, tela.height, -((index * (speed / 2)) % tela.width) + tela.width, 0, tela.width, tela.height);
  // background second part
  ctx.drawImage(img, 0, 0, tela.width, tela.height, -(index * (speed / 2)) % tela.width, 0, tela.width, tela.height);
  
  // trave display
  if (gamePlaying){
    traves.map(trave => {
      // movimento da trave
      trave[0] -= speed;

      // topo da trave
      ctx.drawImage(img, 432, 588 - trave[1], traveWidth, trave[1], trave[0], 0, traveWidth, trave[1]);
      // baixo da trave
      ctx.drawImage(img, 432 + traveWidth, 108, traveWidth, tela.height - trave[1] + traveGap, trave[0], trave[1] + traveGap, traveWidth, tela.height - trave[1] + traveGap);

      // Se tiver um ponto cria uma trave
      if(trave[0] <= -traveWidth){
        currentScore++;
        ponto.play();

        // Checar se é o maior score
        bestScore = Math.max(bestScore, currentScore);
        
        // Remover e criar nova trave
        traves = [...traves.slice(1), [traves[traves.length-1][0] + traveGap + traveWidth, traveLoc()]];
        console.log(traves);
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
    ctx.fillText(`Melhor pontuação: ${bestScore}`, 40, 245);
    ctx.fillText('Clique para dar inicio', 15, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

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
