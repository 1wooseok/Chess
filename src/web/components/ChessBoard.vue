<template>
  <div>
    <h2>CurrentPlayer: {{ EColor[ref_currentPlayersColor] }}</h2>
  </div>

  <div>
    <h2>Status: {{ ref_gameStatus == EGameStatus.None ? "-" : EGameStatus[ref_gameStatus] }}</h2>
  </div>

  <div
      v-if="ref_gameStatus == EGameStatus.Draw || ref_gameStatus == EGameStatus.Checkmate || ref_gameStatus == EGameStatus.Resigns">
    <button @click="handleReplay">Replay</button>
  </div>

  <div v-if="ref_gameStatus == EGameStatus.Promotion" class="promotion_popup">
    <div v-for="optionItem in Object.keys(EPromotionOptions)" :key="optionItem">
      <div
          class="promotion_option"
          @click="handlePromotion(EPromotionOptions[optionItem])"
      >
        {{ optionItem }}
      </div>
    </div>
  </div>


  <div class="dead-piece-list">
    <div v-for="whiteDeadPiece in ref_deadPieces.filter(p => p.color == EColor.White)" class="dead-piece">
      {{ whiteDeadPiece.symbol }}
    </div>
  </div>

  <div class="board">
    <div v-for="(row, y) in ref_grid" :key="y" class="row">
      <div
          v-for="(piece, x) in row"
          :key="x"
          class="chess-square"
          :class="{
            'white-square': (y + x) % 2 == 0,
            'black-square': (y + x) % 2 != 0,
            'highlight': isMoveablePosition(x, y)
          }"
          @dragstart="handleDragStart(x, y)"
          @dragover="handleDragOver"
          @drop="handleDrop(x, y)"
          :draggable="piece?.color == ref_currentPlayersColor && (ref_gameStatus == EGameStatus.None || ref_gameStatus == EGameStatus.Check)"
      >
        <div
            :class="{
              'disabled': piece != null && ref_currentPlayersColor != piece.color,
              'able': piece != null && ref_currentPlayersColor == piece.color
            }"
        >
          {{ piece?.symbol }}
        </div>
      </div>
    </div>
  </div>

  <div class="dead-pieces">
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
const ref_selectedPiece = ref<Piece | null>(null);
const ref_movablePositions = ref<Position[]>([]);
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
    ref_movablePositions.value = [];
    if (nextGameStatus != EGameStatus.Promotion) {
      ref_selectedPiece.value = null;
    }
  });
});
onUnmounted(() => {

})

// event handler
function handleDragStart(x: number, y: number): void {
  if (ref_gameStatus.value == EGameStatus.Promotion) {
    return;
  }

  const piece = board.getPieceAt(new Position(x, y));

  if (piece == null || ref_currentPlayersColor.value != piece.color) {
    ref_selectedPiece.value = null;
    return;
  }

  console.log({p0: piece.position});
  ref_selectedPiece.value = piece;
  ref_movablePositions.value = piece.getMovableAndAttackableAndSafePositions(board);
}
function handleDragOver(e: Event): void {
  e.preventDefault();
}
function handleDrop(x: number, y: number): void {
  if (!isMoveablePosition(x, y)) {
    return;
  }

  const piece = ref_selectedPiece.value as Piece;
  const destination = new Position(x, y);
  console.log({p1: piece.position});
  gameManager.onMove(piece, destination);
}

function handlePromotion(promotionOption: EPromotionOptions): void {
  const piece = ref_selectedPiece.value as Piece;

  // FIXME: `ref_selected.position`이 왜 바뀌는지 모르겠음.
  console.log({p2: piece.position});
  gameManager.promotion(piece, promotionOption);
}

function handleReplay() {
  gameManager.replay();
}

// helper
function isMoveablePosition(x: number, y: number): boolean {
  return ref_movablePositions.value.some((movablePosition) => movablePosition.equals(new Position(x, y)));
}
</script>


<style scoped>
.board {
  display: flex;
  flex-wrap: wrap;

  width: 800px;
  height: 800px;
}

.row {
  display: flex;
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

.disabled:hover {
  cursor: not-allowed;
}

.able:hover {
  cursor: grab;
}

.promotion_popup {
  display: flex;
  gap: 16px;
}

.promotion_option {
  width: 80px;
  height: 80px;

  background: black;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.dead-piece-list {
  height: 40px;
  display: flex;
}

.dead-piece {
  font-size: 32px;
}
</style>
