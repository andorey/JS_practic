(function() {
    const game = document.getElementById('game');
    const columnNum = Math.floor(window.innerWidth / 34);
    const rowsNum = Math.floor(window.innerHeight / 26);
    const lineCheck = Array.from({length: rowsNum}, () => Array.from({length: columnNum}, () => 0));
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const fieldGame = game.querySelector('#fieldGame');
    const buttonSound = game.querySelector('#sounds');
    const counter = game.querySelector('.counter');

    let [volume, mice, errors, direction, number] = [0.02, 3, false, 'right', 0];
    let interval = setInterval(move, 200);

    build()

    const startSnake = coordinates(5, 3)
    const bodySnake = [0, 0, 0].map((el, i) => game.querySelector(`[data-xy='${startSnake[0] - i},${startSnake[1]}']`));

    food()

    function build() {
        lineCheck.forEach((el, i) => {
            let div = document.createElement('div');
            el.map((el, k) => {
                let span = document.createElement('span');
                span.dataset.xy = `${k},${i}`;
                div.appendChild(span);
            });
            fieldGame.appendChild(div);
        })
    }

    function coordinates(max, min) {
        let x = Math.round(Math.random() * (columnNum - max) + min);
        let y = Math.round(Math.random() * (rowsNum - 2) + 1);
        return [x, y]
    }

    function food() {
        let mouse = [0, 0, 0].map(() =>
            game.querySelector(`[data-xy='${coordinates(2, 1)[0]},${coordinates(2, 1)[1]}']`)
        );

        while (mouse.some(el => el.classList.contains('snakeHead') ||
            el.classList.contains('snakeBody')) ||
            [...new Set(mouse)].length !== 3
            ) {
            mouse = [0, 0, 0].map(() =>
                game.querySelector(`[data-xy='${coordinates(2, 1)[0]},${coordinates(2, 1)[1]}']`)
            );
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

            if (mice < 1) {
                setTimeout(food, 200);
                mice = 3;
            }
            counter.querySelector('span').innerText = (number += 10);
        }
    }

    function moveDirect(direct, xy) {
        if (direct === 'right') {
            if (xy[0] + 1 === columnNum) {
                bodySnake.unshift(game.querySelector(`[data-xy='0,${xy[1]}']`));
            } else {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
            }
        } else if (direct === 'left') {
            if (xy[0] - 1 < 0) {
                bodySnake.unshift(game.querySelector(`[data-xy='${columnNum - 1},${xy[1]}']`));
            } else {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
            }
        } else if (direct === 'up') {
            if (xy[1] - 1 < 0) {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0]},${rowsNum - 1}']`));
            } else {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
            }
        } else if (direct === 'down') {
            if (xy[1] + 1 === rowsNum) {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0]},0']`));
            } else {
                bodySnake.unshift(game.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
            }
        }
    }

    function soundEffect(action) {
        const osc = audioCtx.createOscillator();
        const gainV = audioCtx.createGain();

        osc.connect(gainV);
        gainV.connect(audioCtx.destination);

        if (action === 'eat') {
            gainV.gain.value = volume;
            osc.frequency.value = 410;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(() => osc.stop(), 5);

        } else if (action === 'die') {
            gainV.gain.value = volume * 2;
            osc.frequency.value = 55;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(() => osc.stop(), 550);

        } else {
            gainV.gain.value = volume;
            osc.frequency.value = 210;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(() => osc.stop(), 100);
        }
    }

    window.addEventListener('keydown', function (event) {
        if (errors === true) {
            if (event.key === 'ArrowLeft' && direction !== 'right') {
                direction = 'left';
                errors = false;
            } else if (event.key === 'ArrowRight' && direction !== 'left') {
                direction = 'right';
                errors = false;
            } else if (event.key === 'ArrowUp' && direction !== 'down') {
                direction = 'up';
                errors = false;
            } else if (event.key === 'ArrowDown' && direction !== 'up') {
                direction = 'down';
                errors = false;
            }
        }
    })

    buttonSound.addEventListener('click', function () {
        if ( buttonSound.classList.contains('active') ) {
            buttonSound.classList.remove('active');
            volume = 0;

        } else {
            buttonSound.classList.add('active');
            volume = 0.02;
        }
    })

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
}());