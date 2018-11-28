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
        this.emptySquareSymbol = "-";
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.size; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }

    }
    debugBoard() {
        let boardString = '\n';
        let moveCount = 0;
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
                if (this.dataModel[row][col] !== this.emptySquareSymbol) {
                    moveCount += 1;
                }
            }
            boardString = boardString + '\n';
        }
        console.log('The data model after ' + moveCount + ' move(s):' + boardString);
    }
    takeTurns() {
        if (this.gameIsWon()) {
            let message = '     Game Over.\n        ';
            if (this.activeMarker instanceof PrincessMarker) {
                message = message + 'The Princess wins.';
            }
            else if (this.activeMarker instanceof StrangerMarker) {
                message = message + 'The Stranger wins.';
            }
            game.end(message);
            return;
        }
        if (this.gameIsDrawn()) {
            game.end('      Game Over.\n        The game ends in a draw');
            return;
        }
        if (!this.activeMarker) {
            if (Math.random() > .5) {
                this.activeMarker = new PrincessMarker(this);
            }
            else {
                this.activeMarker = new StrangerMarker(this);
            }
        }
        else if (this.activeMarker instanceof StrangerMarker) {
            this.activeMarker = new PrincessMarker(this);
        }
        else if (this.activeMarker instanceof PrincessMarker) {
            this.activeMarker = new StrangerMarker(this);
        }

    }
    gameIsWon() {
        if (this.dataModel[0][0] === this.dataModel[1][1] && this.dataModel[1][1] === this.dataModel[2][2] && this.dataModel[2][2] !== this.emptySquareSymbol) {
            return true;
        }
        if (this.dataModel[2][0] === this.dataModel[1][1] && this.dataModel[1][1] === this.dataModel[0][2] && this.dataModel[0][2] !== this.emptySquareSymbol) {
            return true;
        }
        for (let col = 0; col < 3; col++) {
            if (this.dataModel[0][col] === this.dataModel[1][col] && this.dataModel[1][col] === this.dataModel[2][col] && this.dataModel[2][col] !== this.emptySquareSymbol) {
                return true;
            }
        }
        for (let row = 0; row < 3; row++) {
            if (this.dataModel[row][0] === this.dataModel[row][1] && this.dataModel[row][1] === this.dataModel[row][2] && this.dataModel[row][2] !== this.emptySquareSymbol) {
                return true;
            }
        }
    }
    gameIsDrawn() {
        for (let row = 0; row < this.size; row = row + 1) {

            for (let col = 0; col < this.size; col = col + 1) {
                if (this.dataModel[row][col] == this.emptySquareSymbol) {
                    return false;
                }
            }
        }
        return true;
    }
    getSquareSymbol(row, col) {
        return this.dataModel[row][col];
    }
    markSquare(row, col, forOpponent) {
        let squareSymbol = this.activeMarker.squareSymbol;
        if (this.getSquareSymbol(row, col) === this.emptySquareSymbol) {
            this.dataModel[row][col] = squareSymbol;
            return true;
        }
        return false;
    }
    unmarkSquare(row, col){
        this.dataModel[row][col] = this.emptySquareSymbol;
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
        this.squareSymbol = this.name.substring(0, 1);
        this.inBoard = false;
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * this.board.squareSize + this.board.squareSize / 2 - this.width / 2;
        this.y = this.board.y + row * this.board.squareSize + this.board.squareSize / 2 - this.height / 2;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
        this.inBoard = true;

    }

}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", "Princess Ann");
        this.dragging = false;
        this.board.x;
    }
    handleMouseLeftButtonDown() {
        if (this.inBoard) {
            return;
        }
        this.dragging = true;

    }
    handleMouseLeftButtonUp() {
        if (this.inBoard) {
            return;
        }


        this.dragging = false;
        let row = Math.floor((game.getMouseY() - this.board.y) / this.board.squareSize);
        let col = Math.floor((game.getMouseX() - this.board.x) / this.board.squareSize);
        if (row < 0 || row >= this.board.size || col < 0 || col >= this.board.size
        || this.board.getSquareSymbol(row, col) !== this.board.emptySquareSymbol) {
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
    constructor(board) {
        super(board, "strangerFace.png", "Stranger");



    }

    findWinningMove() {
        return false;
    }

    findForkingMove() {
        return false;
    }

    findCenterMove() {
        let center = Math.floor(this.board.size / 2);
        if(this.board.markSquare()){
           this.playInSquare(center, center); 
        }
        return false;
    }

    findOppositeCornerMove() {
        return false;
    }

    findAnyCornerMove() {
        return false;
    }

    findAnySideMove() {
        return false;
    }
    handleGameLoop() {
        if (this.inBoard) {
            return;

        }

        let row, col;
        do {
            row = Math.round(Math.random() * (this.board.size - 1));
            col = Math.round(Math.random() * (this.board.size - 1));
        } while (this.board.dataModel[row][col] !== this.board.emptySquareSymbol);
        this.board.dataModel[row][col] = this.squareSymbol;
        this.playInSquare(row, col);
        this.board.takeTurns();
        let foundMove = this.findWinningMove();

        if (!foundMove) {
            foundMove = this.findWinningMove(true);
        }

        if (!foundMove) {
            foundMove = this.findForkingMove();
        }

        if (!foundMove) {
            foundMove = this.findForkingMove(true);
        }

        if (!foundMove) {
            foundMove = this.findCenterMove();
        }

        if (!foundMove) {
            foundMove = this.findOppositeCornerMove();
        }

        if (!foundMove) {
            foundMove = this.findAnyCornerMove();
        }

        if (!foundMove) {
            foundMove = this.findAnySideMove();
        }

        if (!foundMove) {
            // Mark a random empty square.
        }

        //if (!foundMove) throw new Error('Failed to find a move.');
    }

}

let theBoard = new TicTacToe();
theBoard.takeTurns();
