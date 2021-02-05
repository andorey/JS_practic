(function () {

    class Driver {
        constructor() {
            this.game = document.querySelector('#game');
            this.columnNum = Math.floor(window.innerWidth / 34);
            this.rowsNum = Math.floor(window.innerHeight / 26);
            this.lineCheck = Array.from({length: this.rowsNum}, () => Array.from({length: this.columnNum}, () => 0));
            this.volume = 0.02
        }

        creator() {
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
            sounds.addEventListener('click', (e) => {
                // e.target
                if (sounds.classList.contains('active')) {
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

        draw() {
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

        restartGame(){
            let div = document.createElement('div');
            div.classList.add('field');
            div.innerHTML = '<div>GAME OVER!</div>';
            this.game.appendChild(div);

            let button = document.createElement('button');
            button.innerHTML = 'RESTART';
            button.classList.add('button');
            div.appendChild(button);
            button.addEventListener('click', () => location.reload());
        }
    }



    class Snake {
        constructor() {
            this.columnNum = new Driver().columnNum;
            this.rowsNum = new Driver().rowsNum;
            this.direction = 'right';
            this.errors = false;
            this.mice = 3;
            [this.x, this.y] = this.coordinates('snake');
            this.bodySnake = [0, 0, 0].map((el, i) => document.querySelector(`[data-xy='${this.x - i},${this.y}']`));

            window.addEventListener('keydown', (event)=> {
                if ( this.errors === true ) {
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

            this.moveDirect( xy );
            this.errors = true;

            new Sound().soundEffect('move');

            this.bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));

            if ( this.bodySnake[0].classList.contains('food') ) {
                this.bodySnake[0].classList.remove('food');
                this.bodySnake.push(document.querySelector(`[data-xy='${xy[0]},${xy[1]}']`));
                new Sound().soundEffect();
                this.mice -= 1;

                if ( this.mice < 1 ) {
                    setTimeout( ()=> new Food().createFood() , 200 );
                    this.mice = 3;
                }

                let count = document.querySelector('.counter>span')
                count.innerHTML = parseInt( count.innerHTML ) + 10;
            }

            if ( this.bodySnake[0].classList.contains('snakeBody') ) {
                new Sound().soundEffect('die');
                clearInterval(interval);
                new Driver().restartGame()
            }
        }

        moveDirect( xy ) {
            if ( this.direction === 'right' ) {
                if ( xy[0] + 1 === this.columnNum ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='0,${xy[1]}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
                }
            } else if ( this.direction === 'left' ) {
                if ( xy[0] - 1 < 0 ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${this.columnNum - 1},${xy[1]}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
                }
            } else if ( this.direction === 'up' ) {
                if ( xy[1] - 1 < 0 ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${this.rowsNum - 1}']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
                }
            } else if ( this.direction === 'down' ) {
                if ( xy[1] + 1 === this.rowsNum ) {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},0']`));
                } else {
                    this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
                }
            }
        }

        coordinates( str ) {
            let x = Math.round(Math.random() * (this.columnNum - 4) + 2);
            let y = Math.round(Math.random() * (this.rowsNum - 2) + 1);

            if ( str === 'snake' ) {
                return [x, y];
            } else {
                return document.querySelector(`[data-xy='${x},${y}']`);
            }
        }

    }


    class Food {
        constructor() {
            this.mouse = [0, 0, 0].map( el => el = new Snake().coordinates() );
        }

        createFood(){
            while ( this.mouse.some(el => el.classList.contains('snakeHead') ||
                el.classList.contains('snakeBody')) ||
                [...new Set(this.mouse)].length !== 3
                ) {

                this.mouse = [0, 0, 0].map( el => el = new Snake().coordinates() );
            }
            this.mouse.map( el => el.classList.add('food') );
        }

    }

    class Sound {
        constructor() {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.volume = driver.volume;
        }

        soundEffect(action) {
            const osc = this.audioCtx.createOscillator();
            const gainV = this.audioCtx.createGain();

            osc.connect(gainV);
            gainV.connect(this.audioCtx.destination);

            if (action === 'move') {
                gainV.gain.value = this.volume;
                osc.frequency.value = 410;
                osc.type = 'sawtooth';

                osc.start();
                setTimeout(() => osc.stop(), 5);
            } else if (action === 'die') {
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
    }




    const driver = new Driver()
    driver.creator();
    driver.draw();

    let snake = new Snake()
    let interval = setInterval( () => snake.move(), 200 )

    new Food().createFood()


})()