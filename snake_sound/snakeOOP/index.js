

class Driver {
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
}


const driver = new Driver()
driver.creator();
driver.draw();


class Snake {
    constructor() {
        this.columnNum = new Driver().columnNum;
        this.rowsNum = new Driver().rowsNum;
        [this.x, this.y] = this.coordinates('snake');
        this.bodySnake = [0, 0, 0].map((el, i) => document.querySelector(`[data-xy='${this.x - i},${this.y}']`));
    }

    move() {
        console.log('this.bodySnake move', this.bodySnake);
        let xy = this.bodySnake[0].dataset.xy.split(',').map(Number);
        this.bodySnake.forEach((el) => el.classList.remove('snakeHead', 'snakeBody'));
        this.bodySnake.pop();

        console.log('xy', xy)
        this.bodySnake.unshift(document.querySelector(`[data-xy='${xy[0] + 1},${xy[1]}']`));

        this.bodySnake.map((e, i) => i === 0 ? e.classList.add('snakeHead') : e.classList.add('snakeBody'));
    }

    coordinates( str ) {
        let x = Math.round(Math.random() * (this.columnNum - 4) + 2);
        let y = Math.round(Math.random() * (this.rowsNum - 2) + 1);

        if ( str === 'snake' ) {
            return [x, y];
        }else{
            return document.querySelector(`[data-xy='${x},${y}']`);
        }
    }

}

let snakke = new Snake()
setInterval( () => snakke.move(), 200)



class Food {
    constructor() {

    }

}
