(function () {
    const game = document.getElementById('game');
    const columnNum = Math.floor(window.innerWidth / 34);
    const rowsNum = Math.floor(window.innerHeight / 26);
    const lineCheck = Array.from( {length: rowsNum}, () => Array.from({length: columnNum}, () => 0) );
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const buttonSound = document.querySelector('#sound');
    const counter = document.querySelector('.counter');

    let [volume, mice, errors] = [0.02, 3, false];
    let direction = 'right';
    let interval = setInterval(move, 200);

    // let header = document.createElement('div');
    // let score = document.createElement('span');
    // let counter = document.createElement('span');
    // let sound = document.createElement('button');
    // header.classList.add('header');
    // score.classList.add('score');
    // score.innerHTML= '<u>Total score:</u>  ';
    // counter.classList.add('counter');
    // counter.innerHTML = 0;
    // score.appendChild(counter);
    // header.appendChild(score);
    // sound.classList.add('sound');
    // sound.classList.add('active');
    // sound.innerHTML = '&#9835';
    // header.append(sound);
    // game.appendChild(header);

    lineCheck.forEach((el, i) => {
        let div = document.createElement('div');
        el.map((el, k) => {
            let span = document.createElement('span');
            span.dataset.xy = `${k},${i}`;
            div.appendChild(span);
        });
        game.appendChild(div);
    })

    const xy = startSnake();
    const bodySnake = [0, 0, 0].map((el, i) => document.querySelector(`[data-xy='${xy[0] - i},${xy[1]}']`));
    food();

    function startSnake() {
        let x = Math.round(Math.random() * (columnNum - 5) + 3);
        let y = Math.round(Math.random() * (rowsNum - 2) + 1);
        return [x, y];
    }

    function food() {
        function coordinates() {
            let x = Math.round(Math.random() * (columnNum - 3) + 2);
            let y = Math.round(Math.random() * (rowsNum - 2) + 1);
            return document.querySelector(`[data-xy='${x},${y}']`);
        }

        let mouse = [0, 0, 0].map(coordinates);

        while (mouse.some(el => el.classList.contains('snakeHead') ||
            el.classList.contains('snakeBody')) ||
            [...new Set(mouse)].length !== 3
            ) {
            mouse = [0, 0, 0].map(coordinates);
        }
        mouse.map(el => el.classList.add('food'));
    }

    function move() {
        let xy = bodySnake[0].dataset.xy.split(',').map(Number);
        bodySnake.forEach((el) => el.classList.remove('snakeHead', 'snakeBody'));
        bodySnake.pop();

        moveDirect(direction, xy);
        soundEffect('eat');
        errors = true;

        bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));
        restartGame();

        if (bodySnake[0].classList.contains('food')) {
            bodySnake[0].classList.remove('food');
            bodySnake.push(document.querySelector(`[data-xy='${xy[0]},${xy[1]}']`));
            soundEffect();
            mice -= 1;

            if ( mice < 1 ) {
                setTimeout(food, 200);
                mice = 3;
            }
            counter.innerHTML = Number(counter.innerHTML) + 10;
        }
    }

    function moveDirect(direction, xy) {
        if ( direction === 'right' ) {
            if ( xy[0] + 1 === columnNum ) {
                bodySnake.unshift(document.querySelector(`[data-xy='0,${xy[1]}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
            }
        } else if ( direction === 'left' ) {
            if ( xy[0] - 1 < 0 ) {
                bodySnake.unshift(document.querySelector(`[data-xy='${columnNum - 1},${xy[1]}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
            }
        } else if ( direction === 'up' ) {
            if ( xy[1] - 1 < 0 ) {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${rowsNum - 1}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
            }
        } else if ( direction === 'down' ) {
            if ( xy[1] + 1 === rowsNum ) {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},0']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
            }
        }
    }

    function restartGame() {
        if ( bodySnake[0].classList.contains('snakeBody') ) {
            soundEffect('die');
            clearInterval(interval);

            let body = document.querySelector('body');
            let div = document.createElement('div');
            div.classList.add('field');
            div.innerHTML = '<div>GAME OVER!</div>';
            body.appendChild(div);

            let button = document.createElement('button');
            button.innerHTML = 'RESTART';
            button.classList.add('button');
            div.appendChild(button);
            button.addEventListener('click', () => location.reload());
        }
    }

    function soundEffect(action) {
        const osc = audioCtx.createOscillator();
        const gainV = audioCtx.createGain();

        osc.connect(gainV);
        gainV.connect(audioCtx.destination);

        if ( action === 'eat' ) {
            gainV.gain.value = volume;
            osc.frequency.value = 410;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(function () {
                osc.stop();
            }, 5);
        } else if ( action === 'die' ) {
            gainV.gain.value = volume * 2;
            osc.frequency.value = 55;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(function () {
                osc.stop()
            }, 550)
        } else {
            gainV.gain.value = volume;
            osc.frequency.value = 210;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(function () {
                osc.stop()
            }, 100);
        }
    }

    window.addEventListener('keydown', function (event) {
        if (errors === true) {
            if ( event.key === 'ArrowLeft' && direction !== 'right' ) {
                direction = 'left';
                errors = false;
            } else if ( event.key === 'ArrowRight' && direction !== 'left' ) {
                direction = 'right';
                errors = false;
            } else if ( event.key === 'ArrowUp' && direction !== 'down' ) {
                direction = 'up';
                errors = false;
            } else if ( event.key === 'ArrowDown' && direction !== 'up' ) {
                direction = 'down';
                errors = false;
            }
        }
    })

    buttonSound.addEventListener('click', function () {
        if ( buttonSound.classList.contains('active') ) {
            buttonSound.classList.remove('active');
            buttonSound.innerHTML = '&#9835';
            volume = 0;

        } else {
            buttonSound.classList.add('active');
            buttonSound.innerHTML = '&#9835';
            volume = 0.02;
        }
    })
}())