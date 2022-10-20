const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');
const img = new Image();
img.src = "/img/flappy-ball-set.png";

//dificult nivel
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

// general settings
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

// trave settings
const traveWidth = 78;
const traveGap = 270;
const traveLoc = () => (Math.random() * ((tela.height - (traveGap + traveWidth)) - traveWidth)) + traveWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (tela.height / 2) - (size[1] / 2);

  // setup first 3 traves
  traves = Array(3).fill().map((a, i) => [tela.width + (i * (traveGap + traveWidth)), traveLoc()]);
}

const render = () => {
  // make the trave and bird moving 
  index++;

  // ctx.clearRect(0, 0, tela.width, tela.height);

  // background first part 
  ctx.drawImage(img, 0, 0, tela.width, tela.height, -((index * (speed / 2)) % tela.width) + tela.width, 0, tela.width, tela.height);
  // background second part
  ctx.drawImage(img, 0, 0, tela.width, tela.height, -(index * (speed / 2)) % tela.width, 0, tela.width, tela.height);
  
  // trave display
  if (gamePlaying){
    traves.map(trave => {
      // trave moving
      trave[0] -= speed;

      // top trave
      ctx.drawImage(img, 432, 588 - trave[1], traveWidth, trave[1], trave[0], 0, traveWidth, trave[1]);
      // bottom trave
      ctx.drawImage(img, 432 + traveWidth, 108, traveWidth, tela.height - trave[1] + traveGap, trave[0], trave[1] + traveGap, traveWidth, tela.height - trave[1] + traveGap);

      // give 1 point & create new trave
      if(trave[0] <= -traveWidth){
        currentScore++;
        // check if it's the best scoreend
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new trave
        traves = [...traves.slice(1), [traves[traves.length-1][0] + traveGap + traveWidth, traveLoc()]];
        console.log(traves);
      }
    
      // if hit the trave, end
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
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 438, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, tela.height - size[1]);
  } else {
    ctx.drawImage(img, 438, Math.floor((index % 9) / 3) * size[1], ...size, ((tela.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (tela.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Melhor pontuação: ${bestScore}`, 40, 245);
    ctx.fillText('Clique para dar inicio', 15, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;

// start game
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;