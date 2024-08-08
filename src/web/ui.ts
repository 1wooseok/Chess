import GameManager from "../core/chess/GameManager";
import "./style.css";

export default class WebApplication {
    private _gameManager: GameManager = GameManager.instance;
    private _element: HTMLElement;
    private _boardElement: HTMLDivElement;

    constructor(element: HTMLElement) {
        this._element = element;
        this._boardElement = document.createElement("div");
        this._boardElement.classList.add("board");

        console.log(this._gameManager);
    }

    public run(): void {
        this.initBoardUI();
        this.setupEventListeners();
    }

    private initBoardUI(): void {
        const grid = this._gameManager.board.grid;

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const square = document.createElement('div');
                square.classList.add('chess-square');
                square.classList.add((y + x) % 2 == 0 ? 'white-square' : 'black-square');

                const symbol = grid[y][x]?.symbol;
                if (symbol) {
                    const piece = document.createElement("div");
                    piece.innerHTML = symbol;
                    square.appendChild(piece);
                }

                this._boardElement.appendChild(square);
            }
        }

        this._element.appendChild(this._boardElement);
    }

    private setupEventListeners(): void {
        this._boardElement.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            console.log(target);
            // Handle square click logic
        });
    }
}
