(function () {

    // lineCheck.forEach((el, i) => {
    //     let div = document.createElement('div');
    //     el.map((el, k) => {
    //         let span = document.createElement('span');
    //         span.dataset.xy = `${k},${i}`;
    //         div.appendChild(span);
    //     });
    //     game.appendChild(div);
    // })

    // function soundEffect(action) {
    //     const osc = audioCtx.createOscillator();
    //     const gainV = audioCtx.createGain();
    //
    //     osc.connect(gainV);
    //     gainV.connect(audioCtx.destination);
    //
    //     if ( action === 'eat' ) {
    //         gainV.gain.value = volume;
    //         osc.frequency.value = 410;
    //         osc.type = 'sawtooth';
    //
    //         osc.start();
    //         setTimeout(() => osc.stop(), 5);
    //     } else if ( action === 'die' ) {
    //         gainV.gain.value = volume * 2;
    //         osc.frequency.value = 55;
    //         osc.type = 'sawtooth';
    //
    //         osc.start();
    //         setTimeout(() => osc.stop(), 550)
    //     } else {
    //         gainV.gain.value = volume;
    //         osc.frequency.value = 210;
    //         osc.type = 'sawtooth';
    //
    //         osc.start();
    //         setTimeout(() => osc.stop(), 100);
    //     }
    // }

    class CreateField {
        constructor(field) {
            this.field = field;
        }
        draw(){
            this.field.forEach((el, i) => {
                let div = document.createElement('div');
                el.map((el, k) => {
                    let span = document.createElement('span');
                    span.dataset.xy = `${k},${i}`;
                    div.appendChild(span);
                });
                game.appendChild(div);
            })
        }
    }

    class Sound {
        constructor() {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        soundEffect(action) {
            const osc = this.audioCtx.createOscillator();
            const gainV = this.audioCtx.createGain();

            osc.connect(gainV);
            gainV.connect(this.audioCtx.destination);

            if ( action === 'move' ) {
                gainV.gain.value = volume;
                osc.frequency.value = 410;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 5);
            } else if ( action === 'die' ) {
                gainV.gain.value = volume * 2;
                osc.frequency.value = 59;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 550)
            } else {
                gainV.gain.value = volume;
                osc.frequency.value = 210;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 100);
            }
        }
    }

    const general = document.getElementById('content');
    const game = general.querySelector('#game');
    const columnNum = Math.floor(window.innerWidth / 34);
    const rowsNum = Math.floor(window.innerHeight / 26);
    const lineCheck = Array.from( {length: rowsNum}, () => Array.from({length: columnNum}, () => 0) );
    const sounds = new Sound();
    const buttonSound = general.querySelector('#sound');
    const counter = general.querySelector('.counter');

    let [volume, mice, errors] = [0.02, 3, false];
    let direction = 'right';
    let interval = setInterval(move, 200);

    new CreateField(lineCheck).draw();

    const [x, y] = coordinates('snake');
    const bodySnake = [0, 0, 0].map((el, i) => general.querySelector(`[data-xy='${x - i},${y}']`));
    food();

    function coordinates( str ) {
        let x = Math.round(Math.random() * (columnNum - 4) + 2);
        let y = Math.round(Math.random() * (rowsNum - 2) + 1);

        if ( str === 'snake' ) {
            return [x, y];
        }else{
            return general.querySelector(`[data-xy='${x},${y}']`);
        }
    }

    function food() {
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
        sounds.soundEffect('move');
        errors = true;

        bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));
        restartGame();

        if (bodySnake[0].classList.contains('food')) {
            bodySnake[0].classList.remove('food');
            bodySnake.push(general.querySelector(`[data-xy='${xy[0]},${xy[1]}']`));
            sounds.soundEffect();
            mice -= 1;

            if ( mice < 1 ) {
                setTimeout(food, 200);
                mice = 3;
            }
            counter.innerHTML = parseInt(counter.innerHTML) + 10;
        }
    }

    function moveDirect(direction, xy) {
        if ( direction === 'right' ) {
            if ( xy[0] + 1 === columnNum ) {
                bodySnake.unshift(general.querySelector(`[data-xy='0,${xy[1]}']`));
            } else {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
            }
        } else if ( direction === 'left' ) {
            if ( xy[0] - 1 < 0 ) {
                bodySnake.unshift(general.querySelector(`[data-xy='${columnNum - 1},${xy[1]}']`));
            } else {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
            }
        } else if ( direction === 'up' ) {
            if ( xy[1] - 1 < 0 ) {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0]},${rowsNum - 1}']`));
            } else {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
            }
        } else if ( direction === 'down' ) {
            if ( xy[1] + 1 === rowsNum ) {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0]},0']`));
            } else {
                bodySnake.unshift(general.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
            }
        }
    }

    function restartGame() {
        if ( bodySnake[0].classList.contains('snakeBody') ) {
            sounds.soundEffect('die');
            clearInterval(interval);

            let div = document.createElement('div');
            div.classList.add('field');
            div.innerHTML = '<div>GAME OVER!</div>';
            general.appendChild(div);

            let button = document.createElement('button');
            button.innerHTML = 'RESTART';
            button.classList.add('button');
            div.appendChild(button);
            button.addEventListener('click', () => location.reload());
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
            volume = 0;

        } else {
            buttonSound.classList.add('active');
            volume = 0.02;
        }
    })

}())