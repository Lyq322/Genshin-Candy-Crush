const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

ctx.fillStyle = "#0095DD";
ctx.lineWidth = 10
ctx.strokeStyle = "#0d3678";

var col = 6
var row = 6

var imageW = 40
var imageH = 40
var padding = 3
var offsetLeft = 75
var offsetUp = 75

var pyroImage = new Image()
pyroImage.src = "pyro.png"
var cryoImage = new Image()
cryoImage.src = "cryo.png"
var hydroImage = new Image()
hydroImage.src = "hydro.png"
var electroImage = new Image()
electroImage.src = "electro.png"
var anemoImage = new Image()
anemoImage.src = "anemo.png"
var geoImage = new Image()
geoImage.src = "geo.png"

images = [pyroImage, cryoImage, hydroImage, electroImage, anemoImage, geoImage]


var board = new Array(col)
for (let c = 0; c < col; c++) {
  board[c] = new Array(row)
  for (let r = 0; r < row; r++) {
    board[c][r] = Math.floor(6 * Math.random())
  }
}

var clickedPieceC, clickedPieceR
var click = 0

// Wait until all images loaded
counter = 0
for (let i = 0; i < 6; i++) {
  images[i].onload = function () {
    counter++
    if (counter == 6) {
      initialDraw()
    }
  }
}

function initialDraw() {
  updateBoard(board)
  ctx.strokeRect(offsetLeft - 10, offsetUp - 10, col * imageW + (col - 1) * padding + 20, row * imageH + (row - 1) * padding + 20)
  document.addEventListener("click", clicked, false);
}

function clicked(e) {
  const rect = canvas.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      var pieceTop = offsetUp + imageH * r + padding * r
      var pieceBottom = offsetUp + imageH * (r + 1) + padding * r
      var pieceLeft = offsetLeft + imageW * c + padding * c
      var pieceRight = offsetLeft + imageW * (c + 1) + padding * c
      if (pieceLeft <= clickX && clickX <= pieceRight && pieceTop <= clickY && clickY <= pieceBottom) {
        click++
        if (click == 1) {
          clickedPieceC = c
          clickedPieceR = r
          highlight(c, r)
        }
        else {
          if ((c == clickedPieceC && r == clickedPieceR + 1) || (c == clickedPieceC && r == clickedPieceR - 1) || (c == clickedPieceC + 1 && r == clickedPieceR) || (c == clickedPieceC - 1 && r == clickedPieceR)) {
            swap(c, r, clickedPieceC, clickedPieceR)
            setTimeout(function() {
              var consecutive = false
              while (checkConsecutive()) {
                consecutive = true
                console.log("r")
                moveRecursive()
              }
              if (!consecutive) {
                swap(c, r, clickedPieceC, clickedPieceR)
                updateBoard()
              }
            }, 500)
          }
          else if (c == clickedPieceC && r == clickedPieceR) {
            updateBoard()
          }
          click = 0
          updateBoard()
        }
      }
    }
  }
}

function updateBoard() {
  ctx.clearRect(0, 0, 400, 400)
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r] != -1) {
        ctx.beginPath()
        ctx.drawImage(images[board[c][r]], offsetLeft + imageW * c + padding * c, offsetUp + imageH * r + padding * r, imageW, imageH)
        ctx.stroke()
        ctx.closePath()
      }
    }
  }
  ctx.lineWidth = 10;
  ctx.strokeRect(offsetLeft - 10, offsetUp - 10, col * imageW + (col - 1) * padding + 20, row * imageH + (row - 1) * padding + 20)
}

function swap(c, r, clickedPieceC, clickedPieceR) {
  var temp = board[c][r]
  board[c][r] = board[clickedPieceC][clickedPieceR]
  board[clickedPieceC][clickedPieceR] = temp
}


function checkConsecutive() {
  var temp = new Array(col);
  for (let c = 0; c < col; c++) {
    temp[c] = new Array(row);
    for (let r = 0; r < row; r++) {
      temp[c][r] = 0;
    }
  }
  var consecutive = false
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      // up down
      if (r + 2 < row && board[c][r] != -1 && board[c][r] == board[c][r + 1] && board[c][r + 1] == board[c][r + 2]) {
        if (r + 3 < row && board[c][r] == board[c][r + 3]) {
          if (r + 4 < row && board[c][r] == board[c][r + 4]) {
            temp[c][r + 4] = -1
          }
          temp[c][r + 3] = -1
        }
        temp[c][r + 2] = -1
        temp[c][r + 1] = -1
        temp[c][r] = -1
        consecutive = true
      }
      // left pieceRight
      if (c + 2 < col && board[c][r] != -1 && board[c][r] == board[c + 1][r] && board[c + 1][r] == board[c + 2][r]) {
        if (c + 3 < col && board[c][r] == board[c + 3][r]) {
          if (c + 4 < col && board[c][r] == board[c + 4][r]) {
            temp[c + 4][r] = -1
          }
          temp[c + 3][r] = -1
        }
        temp[c + 2][r] = -1
        temp[c + 1][r] = -1
        temp[c][r] = -1
        consecutive = true
      }
    }
  }
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (temp[c][r] == -1) {
        board[c][r] = -1;
      }
    }
  }
  return consecutive
}

function moveDown() {
  for (let c = 0; c < col; c++) {
    var index = 0
    var temp = []
    for (let r = 0; r < row; r++) {
      if (board[c][r] != -1) {
        temp[index] = board[c][r]
        index++
      }
    }
    for (let r = 0; r < row; r++) {
      board[c][r] = -1
    }
    for (let r = 0; r < index; r++) {
      board[c][r + row - index] = temp[r]
    }
  }
}

function moveDownOne() {
  for (let c = 0; c < col; c++) {
    var empty = false
    var temp = new Array(row)
    var index = row - 1
    for (let r = row - 1; r > -1; r--) {
      if (!empty && board[c][r] == -1) {
        empty = true
      }
      else if (empty && board[c][r] == -1) {
        temp[index] = -1
        index--
      }
      else if (!empty && board[c][r] != -1) {
        temp[index] = board[c][r]
        index--
      }
      else if (empty && board[c][r] != -1) {
        temp[index] = board[c][r]
        index--
        empty = false
      }
    }
    for (let r = row - 1; r > -1; r--) {
      board[c][r] = -1
    }
    for (let r = row - 1; r > index; r--) {
      board[c][r] = temp[r]
    }
    if (board[c][0] == -1) {
      board[c][0] = Math.floor(6 * Math.random())
    }
  }
}

function checkMove1() {
  var needMove = false
  for (let c = 0; c < col; c++) {
    var r = 0
    while (board[c][r] == -1 && r < row) {
      r++;
    }
    while (r < row) {
      if (board[c][r] == -1) {
        needMove = true
        break;
      }
      r++;
    }
  }
  return needMove
}

function checkMove2() {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r] == -1) {
        return true
      }
    }
  }
  return false
}

function moveRecursive() {
  if (checkMove2()) {
    setTimeout(function() {
      moveRecursive()
      updateBoard()
      moveDownOne()
    }, 500)
  }
}

function highlight(pieceC, pieceR) {
  ctx.lineWidth = 2
  ctx.strokeRect(offsetLeft + imageW * pieceC + padding * pieceC, offsetUp + imageH * pieceR + padding * pieceR, imageW, imageH)
}

function checkWin(board) {
  var empty = true
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r] != -1) {
        empty = false
      }
    }
  }
  if (empty) {
    setTimeout(function() {
      alert("Congratulations, You Win!")
    }, 100)
    document.removeEventListener("click", clicked)
    return
  }
  else {
    return
  }
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}