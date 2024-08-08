enum EGameStatus {
  None,
  Check,
  Checkmate,
  Stalemate,
  Draw,
  Surrender,
  FiftyMoveRule,
  Over,
  // ThreefoldRepetition, // TODO: 반드시 필요한지
}


export default EGameStatus;
