import Board from "./chess/Board";
import ChessManager from "./chess/ChessManager";

function main(): void {
    ChessManager.createInstance(new Board());
}

main();