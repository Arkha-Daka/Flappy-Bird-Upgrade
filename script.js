let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let selectedBird = localStorage.getItem('selectedBird') || 'images/Bird.png';
bird.src = selectedBird;
img.src = selectedBird;

const coinDisplay = document.getElementById('coinCount');
coinDisplay.textContent = localStorage.getItem('flappyCoins') || 0;

let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let sound_bg = new Audio('sounds effect/backgroundcut.mp3');
sound_bg.loop = true;
sound_bg.volume = 0.10;
let is_paused = false;
const pauseBtn = document.getElementById('pauseBtn');
// properti logo js
let bird_props = bird.getBoundingClientRect();
// untuk gerakin
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown' , (e) => {

    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        sound_bg.play();
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play' || is_paused) return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0){
                element.remove();
            }
            else {
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    sound_bg.pause();
                    sound_bg.currentTime = 0;
                    message.innerHTML = 'Game Over'.fontcolor('red')+ '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }
                else {
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

// tombol kalo mati
    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play' || is_paused) return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if((e.key === 'ArrowUp' || e.key === ' ') && !is_paused && game_state === 'Play'){
                let baseName = selectedBird.split('/').pop();
                let nameOnly = baseName.replace('.png', '');
                let jumpingImg = 'images/' + nameOnly + '-1.png';

                img.src = jumpingImg;
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if((e.key === 'ArrowUp' || e.key === ' ') && !is_paused && game_state === 'Play'){
                img.src = selectedBird;
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

// jarak dan animasi pipa
    let pipe_seperation = 0;
    let pipe_gap = 40;

    function create_pipe(){
        if(game_state != 'Play' || is_paused) return;

        if(pipe_seperation > 115){

            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random () * 43) +8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw'

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);

            let coinY = (pipe_posi + pipe_gap / 2) * window.innerHeight / 100;
            createCoin(window.innerWidth, coinY);

        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);

    let coinCount = parseInt(localStorage.getItem("flappyCoins") || "0");
    document.getElementById("coinCount").innerText = coinCount;

    function createCoin(x, y){

        console.log("Creating coin at:", x, y);
        const coin = document.createElement('img');
        coin.src = 'images/coin.png';
        coin.className = 'coin-sprite';
        coin.style.position = 'absolute';
        coin.style.left = x + 'px';
        coin.style.top = y + 'px';
        document.body.appendChild(coin);

        let coinInterval = setInterval(() => {
            if (game_state !== 'Play' || is_paused) return;

            const coinProps = coin.getBoundingClientRect();
            const birdProps = bird.getBoundingClientRect();

            coin.style.left = (coinProps.left - move_speed) + 'px';

            if (birdProps.left < coinProps.left + coinProps.width &&
                birdProps.left + birdProps.width > coinProps.left &&
                birdProps.top < coinProps.top + coinProps.height &&
                birdProps.top + birdProps.height > coinProps.top
            ) {
                coin.remove();
                clearInterval(coinInterval);
                coinCount += 1;
                localStorage.setItem("flappyCoins", coinCount);
                document.getElementById("coinCount").innerText = coinCount;
            }

            if (coinProps.left < -30) {
                coin.remove();
                clearInterval(coinInterval);
            }
        }, 20);
    }

    pauseBtn.addEventListener('click', () => {
        if(game_state === 'Play') {
            is_paused = !is_paused;
            if(is_paused) {
                pauseBtn.innerHTML = '▶️';
                message.innerHTML = 'Paused<br>Tap ▶️ to Resume or press Enter';
                message.classList.add('messageStyle');
                sound_bg.pause();
            } else {
                pauseBtn.innerHTML = '⏸️';
                message.innerHTML = '';
                message.classList.remove('messageStyle');
                sound_bg.play();
                
                requestAnimationFrame(move);
                requestAnimationFrame(apply_gravity);
                requestAnimationFrame(create_pipe);
            }
        }
    });
}

