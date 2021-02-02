(function () {

    class Display {
        constructor() {
            this.game = document.querySelector('#game');
            this.columnNum = Math.floor(window.innerWidth / 34);
            this.rowsNum = Math.floor(window.innerHeight / 26);
            this.lineCheck = Array.from( {length: this.rowsNum}, () => Array.from({length: this.columnNum}, () => 0) );
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.volume = 0.02;
        }

        creator(){
            const upBar = document.createElement('div');
            upBar.id = 'up-bar';

            const counter = document.createElement('span');
            counter.classList.add('counter');
            counter.innerHTML = '<u>Total score:</u>&nbsp;&nbsp;<span>0</span>';

            const sounds = document.createElement('button');
            sounds.id = 'sounds';
            sounds.classList.add('active');
            sounds.classList.add('active');
            sounds.innerHTML = `&#9835`;
            sounds.addEventListener('click',  (e) => {
                // e.target
                if ( sounds.classList.contains('active') ) {
                    sounds.classList.remove('active');
                    this.volume = 0;
                } else {
                    sounds.classList.add('active');
                    this.volume = 0.02;
                }
            })

            const fieldGame = document.createElement('div');
            fieldGame.id = 'fieldGame';

            this.game.appendChild(upBar);
            upBar.appendChild(counter);
            upBar.appendChild(sounds);
            this.game.appendChild(fieldGame);
        }

        soundEffect(action) {
            const osc = this.audioCtx.createOscillator();
            const gainV = this.audioCtx.createGain();

            osc.connect(gainV);
            gainV.connect(this.audioCtx.destination);

            if ( action === 'move' ) {
                gainV.gain.value = this.volume;
                osc.frequency.value = 410;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 5);
            } else if ( action === 'die' ) {
                gainV.gain.value = this.volume * 2;
                osc.frequency.value = 59;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 550)
            } else {
                gainV.gain.value = this.volume;
                osc.frequency.value = 210;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 100);
            }
        }

        draw(){
            this.lineCheck.forEach((el, i) => {
                let div = document.createElement('div');
                el.map((el, k) => {
                    let span = document.createElement('span');
                    span.dataset.xy = `${k},${i}`;
                    div.appendChild(span);
                });
                this.game.querySelector('#fieldGame').appendChild(div);
            })
        }

        coordinates( str ) {
            let x = Math.round(Math.random() * (this.columnNum - 4) + 2);
            let y = Math.round(Math.random() * (this.rowsNum - 2) + 1);

            if ( str === 'snake' ) {
                return new Snake(x, y);
            }else{
                return general.querySelector(`[data-xy='${x},${y}']`);
            }
        }
    }

    class Snake {
        constructor(x, y) {
            this.columnNum = Math.floor(window.innerWidth / 34);
            this.rowsNum = Math.floor(window.innerHeight / 26);
            this.x = x;
            this.y = y;
            this.bodySnake = [0, 0, 0].map((el, i) => document.querySelector(`[data-xy='${this.x - i},${this.y}']`));
            this.direction = 'right';
            this.errors = false;

            window.addEventListener('keydown', (event)=> {
                if (this.errors === true) {
                    if ( event.key === 'ArrowLeft' && this.direction !== 'right' ) {
                        this.direction = 'left';
                        this.errors = false;
                    } else if ( event.key === 'ArrowRight' && this.direction !== 'left' ) {
                        this.direction = 'right';
                        this.errors = false;
                    } else if ( event.key === 'ArrowUp' && this.direction !== 'down' ) {
                        this.direction = 'up';
                        this.errors = false;
                    } else if ( event.key === 'ArrowDown' && this.direction !== 'up' ) {
                        this.direction = 'down';
                        this.errors = false;
                    }
                }
            })
        }

        move() {
            let xy = this.bodySnake[0].dataset.xy.split(',').map(Number);
            this.bodySnake.forEach((el) => el.classList.remove('snakeHead', 'snakeBody'));
            this.bodySnake.pop();

            this.moveDirect(this.direction, xy);
            //sounds.soundEffect('move');
            this.errors = true;

            this.bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));
            //restartGame();

            if (this.bodySnake[0].classList.contains('food')) {
                this.bodySnake[0].classList.remove('food');
                this.bodySnake.push(document.querySelector(`[data-xy='${xy[0]},${xy[1]}']`));
                //sounds.soundEffect();
                //mice -= 1;

                // if ( mice < 1 ) {
                //     setTimeout(food, 200);
                //     mice = 3;
                // }
                //counter.innerHTML = parseInt(counter.innerHTML) + 10;
            }
            console.log(this.bodySnake)
        }

        moveDirect(direction, xy) {
            if ( direction === 'right' ) {
                if ( xy[0] + 1 === this.columnNum ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='0,${xy[1]}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
                }
            } else if ( direction === 'left' ) {
                if ( xy[0] - 1 < 0 ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${this.columnNum - 1},${xy[1]}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
                }
            } else if ( direction === 'up' ) {
                if ( xy[1] - 1 < 0 ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${this.rowsNum - 1}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
                }
            } else if ( direction === 'down' ) {
                if ( xy[1] + 1 === this.rowsNum ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},0']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
                }
            }
        }

    }


    let game = new Display();
    game.creator()
    game.draw()
    let {x, y} = game.coordinates('snake')
    new Snake(x, y).move()


    document.querySelectorAll('#fieldGame').forEach(function (el) {
        el.addEventListener('click', (e) => {
            game.soundEffect()
        })
    })




    class Food {
        constructor() {

        }

    }



}())