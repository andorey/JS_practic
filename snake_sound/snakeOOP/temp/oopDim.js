
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


class Field {
    constructor() {
        this._game = new Build('game').selector;
        this.spans = this._game.querySelectorAll('span');


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
            osc.frequency.value = 410;
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

new Field();
new Sounds();






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