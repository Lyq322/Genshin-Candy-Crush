const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

var col = 20
var row = 20

var pieceW = 20
var pieceH = 20
var padding = 3

function main() {
  var board = []
  for (let c = 0; c < col; c++) {
    board[c] = []
    for (let r = 0; r < col; r++) {
      board[c][r] = 1
    }
  }
  updateBoard(board)
}

function updateBoard(board) {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r] == 1) {
        ctx.rect(c * pieceW / col, r * pieceH / row, pieceW / col, pieceH / row, offsetleft + board[c][r].x * w / col + padding * board[c][r].x, offsetup + board[c][r].y * h / row + padding * board[c][r].y);
      }
    }
  }
}