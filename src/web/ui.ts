import GameManager from "../core/chess/GameManager";
import "./style.css";

export default class WebApplication {
    private _gameManager: GameManager = GameManager.instance;
    private _element: HTMLElement;

    constructor(element: HTMLElement) {
        this._element = element;

        console.log(this._gameManager);
    }

    public run(): void {
        this.initBoardUI();
        this.setupEventListeners();
    }

    private initBoardUI(): void {
        // const board = gameManager.update();
        const boardElement = document.createElement("div");
        boardElement.classList.add("board");

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('chess-square');
                square.classList.add((row + col) % 2 === 0 ? 'white-square' : 'black-square');
                boardElement.appendChild(square);
            }
        }

        this._element.appendChild(boardElement);
    }

    private setupEventListeners(): void {
        this._element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            console.log(target);
            // Handle square click logic
        });
    }
}
