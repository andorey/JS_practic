const game = document.getElementById('game');
const columnNum = Math.floor(window.innerWidth / 34);
const rowsNum = Math.floor(window.innerHeight / 26);
const lineCheck = Array.from( {length: rowsNum}, ()=> Array.from({length: columnNum}, ()=> 0) );
const audCtx = new (window.AudioContext || window.webkitAudioContext)();
const buttonSound = document.querySelector('#sound');

(function () {
    let [volume, mice, errors] = [0.02, 3, false];
    let counter = document.querySelector('.counter');
    let direction = 'right';
    let interval = setInterval(move, 200);

    lineCheck.forEach((el, i) => {
        let div = document.createElement('div');
        el.map((el, k) => {
            let span = document.createElement('span')
            span.dataset.xy = `${k},${i}`
            div.appendChild(span)
        });
        game.appendChild(div)
    })

    const xy = startSnake()
    const bodySnake = [0, 0, 0].map((el, i) => document.querySelector(`[data-xy='${xy[0] - i},${xy[1]}']`))
    food()

    function startSnake() {
        let x = Math.round(Math.random() * (columnNum - 5) + 3)
        let y = Math.round(Math.random() * (rowsNum - 2) + 1)
        return [x, y]
    }

    function food() {
        function coordinates() {
            let x = Math.round(Math.random() * (columnNum - 3) + 2)
            let y = Math.round(Math.random() * (rowsNum - 2) + 1)
            return document.querySelector(`[data-xy='${x},${y}']`)
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

        directions(direction, xy);
        sound(1, volume);
        errors = true;

        bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'))
        restartGame()

        if (bodySnake[0].classList.contains('food')) {
            bodySnake[0].classList.remove('food');
            bodySnake.push(document.querySelector(`[data-xy='${xy[0]},${xy[1]}']`));
            sound(2, volume);
            mice -= 1;

            if ( mice < 1 ) {
                setTimeout(food, 200);
                mice = 3;
            }
            counter.innerHTML = Number(counter.innerHTML) + 10;
        }
    }

    function directions(direction, xy) {
        if (direction === 'right') {
            if (xy[0] + 1 === columnNum) {
                bodySnake.unshift(document.querySelector(`[data-xy='0,${xy[1]}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
            }
        } else if (direction === 'left') {
            if (xy[0] - 1 < 0) {
                bodySnake.unshift(document.querySelector(`[data-xy='${columnNum - 1},${xy[1]}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
            }
        } else if (direction === 'up') {
            if (xy[1] - 1 < 0) {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${rowsNum - 1}']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
            }
        } else if (direction === 'down') {
            if (xy[1] + 1 === rowsNum) {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},0']`));
            } else {
                bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
            }
        }
    }

    function restartGame() {
        if (bodySnake[0].classList.contains('snakeBody')) {
            sound(3, volume)
            clearInterval(interval)

            let body = document.querySelector('body')
            let div = document.createElement('div')
            div.className = 'field';
            div.innerHTML = '<br><div>GAME OVER!</div>';
            body.appendChild(div);

            let button = document.createElement('button')
            button.innerHTML = 'RESTART';
            button.className = 'button';
            div.appendChild(button);
            button.addEventListener('click', () => location.reload());
        }
    }

    function sound(x) {
        const osc = audCtx.createOscillator();
        const gainV = audCtx.createGain();

        osc.connect(gainV);
        gainV.connect(audCtx.destination);

        if (x === 1) {
            gainV.gain.value = volume;
            osc.frequency.value = 410;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout(function () {
                osc.stop()
            }, 5);
        } else if (x === 3) {
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
        if (buttonSound.classList.contains('active')) {
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