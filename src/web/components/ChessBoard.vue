<template>
  <div>
    <h2>CurrentPlayer: {{ EColor[ref_currentPlayersColor] }}</h2>
  </div>

  <div>
    <h2>Status: {{ ref_gameStatus == EGameStatus.None ? "-" : EGameStatus[ref_gameStatus] }}</h2>
  </div>

  <div v-if="!isDraggable()">
    <button @click="handleReplay">Replay</button>
  </div>

  <div class="dead-piece-list">
    <div v-for="whiteDeadPiece in ref_deadPieces.filter(p => p.color == EColor.White)" class="dead-piece">
      {{ whiteDeadPiece.symbol }}
    </div>
  </div>

  <div class="board">
    <!--    promotion-->
    <div v-if="ref_gameStatus == EGameStatus.Promotion" class="promotion-popup">
      <div v-for="optionItem in Object.keys(EPromotionOptions)" :key="optionItem">
        <div
            class="promotion-option"
            @click="handlePromotion(EPromotionOptions[optionItem])"
        >
          {{ optionItem }}
        </div>
      </div>
    </div>

    <!--    grid-->
    <div
        v-for="(row, y) in ref_grid"
        :key="y"
        class="row"
        :class="{ 'event-none': !isDraggable() }"
    >
      <div
          v-for="(piece, x) in row"
          :key="x"
          class="chess-square"
          :class="{
            'white-square': (y + x) % 2 == 0,
            'black-square': (y + x) % 2 != 0,
            'highlight': isMoveablePosition(x, y),
            'cursor-not-allowed': piece != null && ref_currentPlayersColor != piece.color,
            'cursor-grab': piece != null && ref_currentPlayersColor == piece.color,
          }"
          :draggable="isDraggable() && (piece?.color == ref_currentPlayersColor)"
          @dragover="handleDragOver"
          @drop="handleDrop(x, y)"
          @dragstart="handleDragStart(x, y)"
      >
        {{ piece?.symbol }}
      </div>
    </div>
  </div>

  <div class="dead-piece-list">
    <div v-for="blackDeadPiece in ref_deadPieces.filter(p => p.color == EColor.Black)" class="dead-piece">
      {{ blackDeadPiece.symbol }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import GameManager from "../../core/chess/GameManager";
import {Grid} from "../../core/board/Board.type";
import Position from "../../core/piece/Position";
import {Piece} from "../../core/piece/internal";
import EColor from "../../core/enum/EColor";
import EGameStatus from "../../core/enum/EGameStatus";
import EPromotionOptions from "../../core/enum/EPromotionOptions";

const gameManager = GameManager.instance;
const board = gameManager.board;

// ref
const ref_grid = ref<Grid>(board.grid);
const ref_currPiece = ref<Piece | null>(null);
const ref_currMovablePositions = ref<Position[]>([]);
const ref_currentPlayersColor = ref<EColor>(gameManager.currentPlayer);
const ref_gameStatus = ref<EGameStatus>(gameManager.status);
const ref_deadPieces = ref<Piece[]>(gameManager.deadPieces);
//

onMounted(() => {
  GameManager.instance.subscribe((newGrid: Grid, nextPlayer: EColor, nextGameStatus: EGameStatus, nextDeadPieces: Piece[]) => {
    ref_grid.value = newGrid;
    ref_currentPlayersColor.value = nextPlayer;
    ref_gameStatus.value = nextGameStatus;
    ref_deadPieces.value = nextDeadPieces;

    // FIXME: HACK
    if (nextGameStatus != EGameStatus.Promotion) {
      ref_currPiece.value = null;
    }
    ref_currMovablePositions.value = [];
  });
});
onUnmounted(() => {

})

// event handler
function handleDragStart(x: number, y: number): void {
  if (!isDraggable()) {
    return;
  }

  if (ref_gameStatus.value == EGameStatus.Promotion) {
    return;
  }

  const piece = board.getPieceAt(new Position(x, y));
  if (piece == null || ref_currentPlayersColor.value != piece.color) {
    ref_currPiece.value = null;
    return;
  }

  ref_currPiece.value = piece;
  ref_currMovablePositions.value = piece.getMovableAndAttackableAndSafePositions(board);
}
function handleDragOver(e: Event): void {
  e.preventDefault();

  if (!isDraggable()) {
    return;
  }
}
function handleDrop(x: number, y: number): void {
  if (!isDraggable()) {
    console.log("!isDraggable()");
    return;
  }

  if (!isMoveablePosition(x, y)) {
    ref_currPiece.value = null;
    ref_currMovablePositions.value = [];
    return;
  }

  const currPiece = ref_currPiece.value as Piece;
  const destination = new Position(x, y);

  gameManager.onMove(currPiece, destination);
}

function handlePromotion(promotionOption: EPromotionOptions): void {
  if (ref_gameStatus.value != EGameStatus.Promotion) {
    return;
  }

  const piece = ref_currPiece.value as Piece;

  // FIXME: `ref_currPiece.position`이 왜 바뀌는지 모르겠음.
  gameManager.promotion(piece, promotionOption);
}

function handleReplay() {
  gameManager.replay();
}

// helper
function isMoveablePosition(x: number, y: number): boolean {
  return ref_currMovablePositions.value.some((movablePosition) => movablePosition.equals(new Position(x, y)));
}

function isDraggable(): boolean {
  return (ref_gameStatus.value == EGameStatus.None) || (ref_gameStatus.value == EGameStatus.Check);
}
</script>


<style scoped>
.board {
  position: relative;

  display: flex;
  flex-wrap: wrap;

  width: 800px;
  height: 800px;
}

.row {
  display: flex;
}

.event-none {
  pointer-events: none;
}

.event-none:hover {
  cursor: not-allowed;
}

.chess-square {
  width: 100px;
  height: 100px;



  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 3rem;
}

.white-square {
  background-color: #FFCF9F;
}

.black-square {
  background-color: #D28C45;
}

.highlight {
  box-sizing: border-box;
  background-color: red;

  border: 1px dashed white;
}

.cursor-not-allowed:hover {
  cursor: not-allowed;
}

.cursor-grab:hover {
  cursor: grab;
}

.promotion-popup {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translateX(-50%) translateY(-45%);

  display: flex;
  gap: 16px;
}

.promotion-option {
  width: 160px;
  height: 160px;

  background: black;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.promotion-option:hover {
  cursor: pointer;
}

.dead-piece-list {
  height: 40px;
  display: flex;
}

.dead-piece {
  font-size: 32px;
}
</style>
