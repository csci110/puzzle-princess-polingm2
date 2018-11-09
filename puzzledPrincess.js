import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");

class TicTacToe extends Sprite {
    constructor() {
        super();
        this.name = "Game Board";
        this.setImage("board.png");
        this.x = 300;
        this.y = 85;
        this.squareSize = 150;
        this.size = 3;
        this.activeMarker;
        this.dataModel = [];
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.boardSize; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }
        this.emptySquareSymbol = "-";
    }
    takeTurns() {
        this.activeMarker = new PrincessMarker(this);
    }
}

class Marker extends Sprite {
    constructor(board, image, name) {
        super();
        this.board = board;
        this.name = name;
        this.setImage(image);
        this.x = 150;
        this.y = 275;
        this.x = this.startX = 150;
        this.y = this.startY = 150;
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * this.board.squareSize + this.board.squareSize / 2 - this.width / 2;
        this.y = this.board.y + row * this.board.squareSize + this.board.squareSize / 2 - this.height / 2;
    }

}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", "Princess Ann");
        this.dragging = false;
        this.board.x;
    }
    handleMouseLeftButtonDown() {
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        this.dragging = false;
        let row = Math.floor((game.getMouseY() - this.board.y) / this.board.squareSize);
        let col = Math.floor((game.getMouseX() - this.board.x) / this.board.squareSize);
        console.log(row, ",", col);
        if (row < 0 || row >= this.board.size || col < 0 || col >= this.board.size) {
            this.x = this.startX;
            this.y = this.startY;
            return;

        }
        this.playInSquare(row, col);
        this.board.takeTurns();
    }
    handleGameLoop() {
        if (this.dragging === true) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }

}

class StrangerMarker extends Marker {

}

let theBoard = new TicTacToe();
theBoard.takeTurns();
