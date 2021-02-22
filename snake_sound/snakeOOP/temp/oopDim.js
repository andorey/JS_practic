
class Build {
    constructor(selector) {
        this.selector = document.getElementById(selector);
        this._rowsNum = Math.floor(window.innerHeight / 27);
        this._columnsNum = Math.floor(window.innerWidth / 34);
        this._field = Array.from({length: this._rowsNum}, () => Array.from({length: this._columnsNum}, () => 0));
        this.topBar();
        this.draw();
    }

    topBar(){
        const soundBar = document.createElement('div');
        soundBar.id = 'top-bar';

        const counter = document.createElement('span');
        counter.classList.add('counter');
        counter.innerHTML = '<u>Total score:</u>&nbsp;&nbsp;<span>0</span>';

        const sounds = document.createElement('button');
        sounds.id = 'sounds';
        sounds.classList.add('active');
        sounds.innerHTML = `&#9835`;

        soundBar.appendChild(counter);
        soundBar.appendChild(sounds);
        this.selector.appendChild(soundBar);
    }

    draw() {
        const field = document.createElement('div');
        field.id ='field';

        this._field.forEach((el, i) => {
            let div = document.createElement('div');

            el.forEach((e, k) => {
                let span = document.createElement('span');

                span.dataset.xy = `${k},${i}`;
                div.appendChild(span);
            })
            field.appendChild(div);
        })
        this.selector.appendChild(field);
    }

}


class Game {
    constructor() {
        this._game = new Build('game');
        this.fieldSpans = this._game.selector.querySelectorAll('span');
        this.rowsNum = this._game._rowsNum;
        this.columnsNum = this._game._columnsNum;
        this.sounds = new Sounds();

        this.snake = new Snake(this.rowsNum, this.columnsNum, this.sounds);
        this.food = new Food(this.rowsNum, this.columnsNum);


        this.interval = setInterval(() => this.snake.move(), 200)
    }


}


class Snake {
    constructor(rowsNum, columnsNum, sounds) {
        this.rows = rowsNum;
        this.columns = columnsNum;
        this.sounds = sounds;
        this.X = Math.round( Math.random() * (this.columns - 4) + 3 );
        this.Y = Math.round( Math.random() * (this.rows - 2) + 1 );
        this.bodySnake = [0, 0, 0].map((_, i) => document.querySelector(`[data-xy='${this.X},${this.Y}']`) );
        this.adjust = new Adjust();

    }

    moveDirect( xy ) {
        if ( this.adjust.direction === 'right' ) {
            if ( xy[0] + 1 === this.columns ) {
                this.bodySnake.unshift(document.querySelector(`[data-xy='0,${xy[1]}']`));
            } else {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));
            }
        } else if ( this.adjust.direction === 'left' ) {
            if ( xy[0] - 1 < 0 ) {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${this.columns - 1},${xy[1]}']`));
            } else {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] - 1},${xy[1]}']`));
            }
        } else if ( this.adjust.direction === 'up' ) {
            if ( xy[1] - 1 < 0 ) {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${this.rows - 1}']`));
            } else {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] - 1}']`));
            }
        } else if ( this.adjust.direction === 'down' ) {
            if ( xy[1] + 1 === this.rows ) {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},0']`));
            } else {
                this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0]},${xy[1] + 1}']`));
            }
        }
    }

    move() {
        let xy = this.bodySnake[0].dataset.xy.split(',').map(Number);
        this.bodySnake.forEach((el) => el.classList.remove('snakeHead', 'snakeBody'));
        this.bodySnake.pop();

        this.moveDirect(xy);
        this.sounds.soundEffect('move');
        this.adjust.errors = true;

        this.bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));

    }

}


class Sounds {
    constructor() {
        this.button = document.querySelector('#sounds');
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.volume = 0.02;
        this.soundButton();
    }

    soundButton(){
        this.button.addEventListener('click', (el) => {
            if (el.target.className === 'active') {
                el.target.classList.remove('active');
                this.volume = 0;
            } else {
                el.target.classList.add('active');
                this.volume = 0.02;
            }
        })
    }

    soundEffect(action) {
        const osc = this.audioCtx.createOscillator();
        const gainV = this.audioCtx.createGain();

        osc.connect(gainV);
        gainV.connect(this.audioCtx.destination);

        if (action === 'move') {
            gainV.gain.value = this.volume;
            osc.frequency.value = 455;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout( () => osc.stop(), 5 );
        } else if (action === 'die') {
            gainV.gain.value = this.volume * 2;
            osc.frequency.value = 59;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout( () => osc.stop(), 550 )
        } else {
            gainV.gain.value = this.volume;
            osc.frequency.value = 210;
            osc.type = 'sawtooth';

            osc.start();
            setTimeout( () => osc.stop(), 100 );
        }
    }

}


class Adjust {
    constructor() {
        this.direction = 'right';
        this.moveDirect();
        this.errors = false;
    }

    moveDirect(){
        window.addEventListener('keydown', event => {
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
            console.log(this.direction)
        })
    }
}


class Food {
    constructor(rowsNum, columnNum) {
        this.columnNum = columnNum;
        this.rowsNum = rowsNum;
        this.createFood();
    }

    get(){
        let x = Math.round(Math.random() * (this.columnNum - 3) + 2);
        let y = Math.round(Math.random() * (this.rowsNum - 2) + 1);
        return `[data-xy='${x},${y}']`;
    }

    createFood(){
        let mouse = [0, 0, 0].map( () => this.get() );

        while ( mouse.some( el => document.querySelector(`${el}`).classList.contains('snakeHead') ) ||
                mouse.some( el => document.querySelector(`${el}`).classList.contains('snakeBody') ) ||
                [...new Set(mouse)].length !== 3
            ) {
            mouse = [0, 0, 0].map( () => this.get() );
        }
        mouse.map( el=> document.querySelector(`${el}`).classList.add('food') );
    }
}


new Game()








// let driver = new Driver;
//
// class Snake{
//     constructor() {
//         this.x = '...'
//         this.y = '...'
//     }
//
//     eat(food) {
//         food.destroy();
//         this.growUp();
//     }
//
//     move() {
//         // depends on move's direction
//         driver.drawLine(arr);
//     }
// }
//
// class Food {
//     constructor() {
//     }
//
// }
//
// class Driver{
//     constructor() {
//     }
//
//     drawLine(arr){
//         // works with spans
//     }
//
//
// }
//
// class GameField{
//     constructor() {
//         this.handleButton();
//
//         this.varavar = 'sdfsd';
//     }
//
//     handleButton() {
//         let btn = '...'
//         btn.addEventListener('click', () => {
//             this.start();
//         })
//     }
//
//     start(){
//         let snake = new Snake(10, 20);
//         let food = new Food(3, 5);
//
//         window.addEventListener('keypress', (e) => {
//             if (e.key === 'ArrowLeft') {
//                 snake.turn('left')
//                 snake.turnLeft();
//             }
//         })
//
//         setInterval(() => {
//             snake.move();
//
//             if (snake.x === food.x && snake.y === food.y) {
//                 snake.eat(food);
//                 //food = new Food(4, 5);
//
//                 this.createFood();
//             }
//
//         })
//     }
//
//     createFood() {
//         // generate rand coords
//
//         return new Food('our rand coords')
//     }
//
//     _generateRandomCoords() {
//
//     }
// }