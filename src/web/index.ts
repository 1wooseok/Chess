import Board from "../core/board/Board";
import GameManager from "../core/chess/GameManager";
import WebApplication from "./ui";

function main(): void {
    GameManager.createInstance(new Board());

    const webApp = new WebApplication(document.getElementById("app")!);
    webApp.run();
}

main();