(function () {

    class Display {
        constructor(volume) {
            this.game = document.querySelector('#game');
            this.columnNum = Math.floor(window.innerWidth / 34);
            this.rowsNum = Math.floor(window.innerHeight / 26);
            this.lineCheck = Array.from( {length: this.rowsNum}, () => Array.from({length: this.columnNum}, () => 0) );
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.volume = volume
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

                console.log(this.volume);
            })

            const fieldGame = document.createElement('div');
            fieldGame.id = 'fieldGame';

            this.game.appendChild(upBar);
            upBar.appendChild(counter);
            upBar.appendChild(sounds);
            this.game.appendChild(fieldGame);
        }

        soundEffect(action) {
            console.log(this.volume)
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

    let game = new Display(0.02);
    game.creator()
    game.draw()

    document.querySelectorAll('#fieldGame').forEach(function (el) {
        el.addEventListener('click', (e) => {
            console.log(e.target.dataset.xy, game.volume)
            game.soundEffect()
        })
    })


    class Logic {
        constructor() {

        }

    }

    class Managment {
        constructor() {

        }

    }



}())