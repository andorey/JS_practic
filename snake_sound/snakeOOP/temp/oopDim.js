// let driver = new Driver;
//
// class Snake{
//     constructor() {
//         this.x = ...
//         this.y = ...
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
//         let btn = ...
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
//             if (e.key == 'ArrowLeft') {
//                 snake.turn('left')
//                 snake.turnLeft();
//             }
//         })
//
//         setInterval(() => {
//             snake.move();
//
//             if (snake.x == food.x && snake.y == food.y) {
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
//         return new Food(our rand coords)
//     }
//
//     _generateRandomCoords() {
//
//     }
// }