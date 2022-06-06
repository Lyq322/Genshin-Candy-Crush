// All images are from Genshin Impact
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")

ctx.fillStyle = "#0095DD";
ctx.lineWidth = 10
ctx.strokeStyle = "#0d3678";

var col = 8
var row = 8

var imageW = 40
var imageH = 40
var padding = 5

var gridOffsetLeft = 75
var gridOffsetUp = 75

// Top offset for each piece
// Used for moving animations
pieceOffsetUp = new Array(col)
for (let c = 0; c < col; c++) {
  pieceOffsetUp[c] = new Array(row)
  for (let r = 0; r < row; r++) {
    pieceOffsetUp[c][r] = 0
  }
}

var consecutive = false

// Images for the game pieces
var folder = "images/"
var pyroImage = new Image()
pyroImage.src = folder + "pyro.png"
var cryoImage = new Image()
cryoImage.src = folder + "cryo.png"
var hydroImage = new Image()
hydroImage.src = folder + "hydro.png"
var electroImage = new Image()
electroImage.src = folder + "electro.png"
var anemoImage = new Image()
anemoImage.src = folder + "anemo.png"
var geoImage = new Image()
geoImage.src = folder + "geo.png"

var hutaoImage = new Image()
hutaoImage.src = folder + "Hutao.png"
var ayakaImage = new Image()
ayakaImage.src = folder + "Ayaka.png"
var kokomiImage = new Image()
kokomiImage.src = folder + "Kokomi.png"
var ittoImage = new Image()
ittoImage.src = folder + "Itto.png"
var raidenImage = new Image()
raidenImage.src = folder + "Raiden.png"
var kazuhaImage = new Image()
kazuhaImage.src = folder + "Kazuha.png"
var yoimiyaImage = new Image()
yoimiyaImage.src = folder + "Yoimiya.png"
var childeImage = new Image()
childeImage.src = folder + "Childe.png"
var albedoImage = new Image()
albedoImage.src = folder + "Albedo.png"
var yaeImage = new Image()
yaeImage.src = folder + "Yae.png"
var ganyuImage = new Image()
ganyuImage.src = folder + "Ganyu.png"
var ventiImage = new Image()
ventiImage.src = folder + "Venti.png"

images = [pyroImage, cryoImage, hydroImage, electroImage, anemoImage, geoImage, hutaoImage, ayakaImage, kokomiImage, raidenImage, kazuhaImage, ittoImage, yoimiyaImage, ganyuImage, childeImage, yaeImage, ventiImage, albedoImage]

var board = new Array(col)
for (let c = 0; c < col; c++) {
  board[c] = new Array(row)
  for (let r = 0; r < row; r++) {
    board[c][r] = {piece: Math.floor(6 * Math.random()), special:0}
  }
}

var clickedPieceC, clickedPieceR
var click = 0

var sleepTime = 20

// Wait until all images loaded
counter = 0
for (let i = 0; i < 18; i++) {
  images[i].onload = function () {
    counter++
    if (counter == 18) {
      console.log("all loaded")
      initialDraw()
    }
  }
}

function initialDraw() {
  updateBoard(board)
  ctx.strokeRect(gridOffsetLeft - 10, gridOffsetUp - 10, col * imageW + (col - 1) * padding + 20, row * imageH + (row - 1) * padding + 20)
  document.addEventListener("click", clicked, false);
  moveFunc()
}

function clicked(e) {
  // Get coordinates of click
  const rect = canvas.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      // Calculate boundaries of each piece
      var pieceTop = gridOffsetUp + imageH * r + padding * r
      var pieceBottom = gridOffsetUp + imageH * (r + 1) + padding * r
      var pieceLeft = gridOffsetLeft + imageW * c + padding * c
      var pieceRight = gridOffsetLeft + imageW * (c + 1) + padding * c

      // Check if click lands on piece
      if (pieceLeft <= clickX && clickX <= pieceRight && pieceTop <= clickY && clickY <= pieceBottom) {
        click++
        // First click
        if (click == 1) {
          clickedPieceC = c
          clickedPieceR = r

          highlight(c, r)
        }
        // Second click
        else {
          // Check if piece is valid
          if ((c == clickedPieceC && r == clickedPieceR + 1) || (c == clickedPieceC && r == clickedPieceR - 1) || (c == clickedPieceC + 1 && r == clickedPieceR) || (c == clickedPieceC - 1 && r == clickedPieceR)) {
            swap(c, r, clickedPieceC, clickedPieceR)
            updateBoard()

            // Check for consecutives, remove them, and move pieces down
            consecutive = false
            moveFunc()
            
            // Don't swap if same click or click not valid
            if (!consecutive) {
              swap(c, r, clickedPieceC, clickedPieceR)
              updateBoard()
            }
          }
          // Erase highlight if same piece clicked
          else if (c == clickedPieceC && r == clickedPieceR) {
            updateBoard()
          }
          // Reset click
          click = 0
          updateBoard()
        }
      }
    }
  }
}

function updateBoard() {
  // Clear board
  ctx.clearRect(0, 0, 1000, 1000)
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r].piece != -1) {
        ctx.beginPath()
        ctx.drawImage(images[board[c][r].piece + board[c][r].special], gridOffsetLeft + imageW * c + padding * c, gridOffsetUp + pieceOffsetUp[c][r] + imageH * r + padding * r, imageW, imageH)
        ctx.stroke()
        ctx.closePath()
      }
    }
  }
  // Frame
  ctx.lineWidth = 10;
  ctx.strokeRect(gridOffsetLeft - 10, gridOffsetUp - 10, col * imageW + (col - 1) * padding + 20, row * imageH + (row - 1) * padding + 20)
}

function swap(c, r, clickedPieceC, clickedPieceR) {
  var temp = board[c][r].piece
  board[c][r].piece = board[clickedPieceC][clickedPieceR].piece
  board[clickedPieceC][clickedPieceR].piece = temp
  temp = board[c][r].special
  board[c][r].special = board[clickedPieceC][clickedPieceR].special
  board[clickedPieceC][clickedPieceR].special = temp
}

function checkConsecutive() {
  var temp = new Array(col);
  for (let c = 0; c < col; c++) {
    temp[c] = new Array(row);
    for (let r = 0; r < row; r++) {
      temp[c][r] = -2;
    }
  }

  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      // Five consecutives up down
      if (r + 4 < row && board[c][r].piece == board[c][r + 1].piece && board[c][r].piece == board[c][r + 2].piece && board[c][r].piece == board[c][r + 3].piece && board[c][r].piece == board[c][r + 4].piece) {
        temp[c][r] = -1
        temp[c][r + 1] = -1
        temp[c][r + 2] = -1
        temp[c][r + 3] = -1
        temp[c][r + 4] = -1
      }
      // Four consecutives up down
      else if (r + 3 < row && board[c][r].piece == board[c][r + 1].piece && board[c][r].piece == board[c][r + 2].piece && board[c][r].piece == board[c][r + 3].piece && (r - 1 < 0 || (r - 1 >= 0 && board[c][r - 1].piece != board[c][r].piece))) {
        temp[c][r] = -1
        temp[c][r + 1] = -1
        temp[c][r + 2] = board[c][r].piece
        temp[c][r + 3] = -1
        board[c][r].special = 0
        board[c][r + 1].special = 0
        board[c][r + 2].special = 12
        board[c][r + 3].special = 0
      }
      // Three consecutives up down
      else if (r + 2 < row && board[c][r].piece == board[c][r + 1].piece && board[c][r].piece == board[c][r + 2].piece && (r - 1 < 0 || (r - 1 >= 0 && board[c][r - 1].piece != board[c][r].piece))) {
        // x x x
        // x
        // x
        if (c + 2 < col && board[c][r].piece == board[c + 1][r].piece && board[c][r].piece == board[c + 2][r].piece) {
          temp[c][r] = board[c][r].piece
          temp[c][r + 1] = -1
          temp[c][r + 2] = -1
          temp[c + 1][r] = -1
          temp[c + 2][r] = -1
          board[c][r].special = 6
          board[c][r + 1].special = 0
          board[c][r + 2].special = 0
          board[c + 1][r].special = 0
          board[c + 2][r].special = 0
        }
        // x x x
        //     x
        //     x
        else if (c - 2 >= 0 && board[c][r].piece == board[c - 1][r].piece && board[c][r].piece == board[c - 2][r].piece) {
          temp[c][r] = board[c][r].piece
          temp[c][r + 1] = -1
          temp[c][r + 2] = -1
          temp[c - 1][r] = -1
          temp[c - 2][r] = -1
          board[c][r].special = 6
          board[c][r + 1].special = 0
          board[c][r + 2].special = 0
          board[c - 1][r].special = 0
          board[c - 2][r].special = 0
        }
        // x
        // x
        // x x x
        else if (c + 2 < col && board[c][r].piece == board[c + 1][r + 2].piece && board[c][r].piece == board[c + 2][r + 2].piece) {
          temp[c][r] = -1
          temp[c][r + 1] = -1
          temp[c][r + 2] = board[c][r].piece
          temp[c + 1][r + 2] = -1
          temp[c + 2][r + 2] = -1
          board[c][r].special = 0
          board[c][r + 1].special = 0
          board[c][r + 2].special = 6
          board[c + 1][r + 2].special = 0
          board[c + 2][r + 2].special = 0
        }
        //     x
        //     x
        // x x x
        else if (c - 2 >= 0 && board[c][r].piece == board[c - 1][r + 2].piece && board[c][r].piece == board[c - 2][r + 2].piece) {
          temp[c][r] = -1
          temp[c][r + 1] = -1
          temp[c][r + 2] = board[c][r].piece
          temp[c - 1][r + 2] = -1
          temp[c - 2][r + 2] = -1
          board[c][r].special = 0
          board[c][r + 1].special = 0
          board[c][r + 2].special = 6
          board[c - 1][r + 2].special = 0
          board[c - 2][r + 2].special = 0
        }
        // x
        // x x x 
        // x
        else if (c + 2 < col && board[c][r].piece == board[c + 1][r + 1].piece && board[c][r].piece == board[c + 2][r + 1].piece) {
          temp[c][r] = -1
          temp[c][r + 1] = board[c][r].piece
          temp[c][r + 2] = -1
          temp[c + 1][r + 1] = -1
          temp[c + 2][r + 1] = -1
          board[c][r].special = 0
          board[c][r + 1].special = 6
          board[c][r + 2].special = 0
          board[c + 1][r + 1].special = 0
          board[c + 2][r + 1].special = 0
        }
        //     x 
        // x x x
        //     x
        else if (c - 2 >= 0 && board[c][r].piece == board[c - 1][r + 1].piece && board[c][r].piece == board[c - 2][r + 1].piece) {
          temp[c][r] = -1
          temp[c][r + 1] = board[c][r].piece
          temp[c][r + 2] = -1
          temp[c - 1][r + 1] = -1
          temp[c - 2][r + 1] = -1
          board[c][r].special = 0
          board[c][r + 1].special = 6
          board[c][r + 2].special = 0
          board[c - 1][r + 1].special = 0
          board[c - 2][r + 1].special = 0
        }
        // x x x
        //   x
        //   x
        else if (c + 1 < col && c - 1 >= 0 && board[c][r].piece == board[c + 1][r].piece && board[c - 1][r].piece) {
          temp[c][r] = board[c][r].piece
          temp[c][r + 1] = -1
          temp[c][r + 2] = -1
          temp[c - 1][r] = -1
          temp[c + 1][r] = -1
          board[c][r].special = 6
          board[c][r + 1].special = 0
          board[c][r + 2].special = 0
          board[c - 1][r].special = 0
          board[c + 1][r].special = 0
        }
        else if (c + 1 < col && c - 1 >= 0 && board[c][r].piece == board[c + 1][r + 2].piece && board[c][r].piece == board[c - 1][r + 2].piece) {
          temp[c][r] = -1
          temp[c][r + 1] = -1
          temp[c][r + 2] = board[c][r].piece
          temp[c - 1][r + 2] = -1
          temp[c + 1][r + 2] = -1
          board[c][r].special = 6
          board[c][r + 1].special = 0
          board[c][r + 2].special = 0
          board[c - 1][r + 2].special = 0
          board[c + 1][r + 2].special = 0
        }
        else {
          temp[c][r] = -1
          temp[c][r + 1] = -1
          temp[c][r + 2] = -1
        }
      }
      // Five consecutives left right
      if (c + 4 < col && board[c][r].piece == board[c + 1][r].piece && board[c][r].piece == board[c + 2][r].piece && board[c][r].piece == board[c + 3][r].piece && board[c][r].piece == board[c + 4][r].piece) {
        temp[c][r] = -1
        temp[c + 1][r] = -1
        temp[c + 2][r] = -1
        temp[c + 3][r] = -1
        temp[c + 4][r] = -1
      }
      // Four consecutives left right
      else if (c + 3 < col && board[c][r].piece == board[c + 1][r].piece && board[c][r].piece == board[c + 2][r].piece && board[c][r].piece == board[c + 3][r].piece && (c - 1 < 0 || (c - 1 >= 0 && board[c - 1][r].piece != board[c][r].piece))) {
        temp[c][r] = -1
        temp[c + 1][r] = -1
        temp[c + 2][r] = board[c][r].piece
        temp[c + 3][r] = -1
        board[c][r].special = 0
        board[c + 1][r].special = 0
        board[c + 2][r].special = 12
        board[c + 3][r].special = 0
      }
      // Three consecutives left right
      else if (c + 2 < col && board[c][r].piece == board[c + 1][r].piece && board[c][r].piece == board[c + 2][r].piece && (c - 1 < 0 || (c - 1 >= 0 && board[c - 1][r].piece != board[c][r].piece))) {
        // x x x
        // x
        // x
        if (r + 2 < row && board[c][r].piece == board[c][r + 1].piece && board[c][r].piece == board[c][r + 2].piece) {
          temp[c][r] = board[c][r].piece
          temp[c + 1][r] = -1
          temp[c + 2][r] = -1
          temp[c][r + 1] = -1
          temp[c][r + 2] = -1
          board[c][r].special = 6
          board[c + 1][r].special = 0
          board[c + 2][r].special = 0
          board[c][r + 1].special = 0
          board[c][r + 2].special = 0
        }
        // x 
        // x 
        // x x x
        else if (r - 2 >= 0 && board[c][r].piece == board[c][r - 1].piece && board[c][r].piece == board[c][r - 2].piece) {
          temp[c][r] = board[c][r].piece
          temp[c + 1][r] = -1
          temp[c + 2][r] = -1
          temp[c][r - 1] = -1
          temp[c][r - 2] = -1
          board[c][r].special = 6
          board[c + 1][r].special = 0
          board[c + 2][r].special = 0
          board[c][r - 1].special = 0
          board[c][r - 2].special = 0
        }
        // x x x
        //     x
        //     x
        else if (r + 2 < row && board[c][r].piece == board[c + 2][r + 1].piece && board[c][r].piece == board[c + 2][r + 2].piece) {
          temp[c][r] = -1
          temp[c + 1][r] = -1
          temp[c + 2][r] = board[c + 2][r] + 6
          temp[c + 2][r + 1] = -1
          temp[c + 2][r + 2] = -1
          board[c][r].special = 0
          board[c + 1][r].special = 0
          board[c + 2][r].special = 6
          board[c + 2][r + 1].special = 0
          board[c + 2][r + 2].special = 0
        }
        //     x
        //     x 
        // x x x
        else if (r - 2 >= 0 && board[c][r].piece == board[c + 2][r - 1].piece && board[c][r].piece == board[c + 2][r - 2].piece) {
          temp[c][r] = -1
          temp[c + 1][r] = -1
          temp[c + 2][r] = board[c + 2][r]
          temp[c + 2][r - 1] = -1
          temp[c + 2][r - 2] = -1
          board[c][r].special = 0
          board[c + 1][r].special = 0
          board[c + 2][r].special = 6
          board[c + 2][r - 1].special = 0
          board[c + 2][r - 2].special = 0
        }
        // x
        // x x x 
        // x
        else if (r - 1 >= 0 && r + 1 < row && board[c][r].piece == board[c][r - 1].piece && board[c][r].piece == board[c][r + 1].piece) {
          temp[c][r] = board[c][r].piece
          temp[c + 1][r] = -1
          temp[c + 2][r] = -1
          temp[c][r + 1] = -1
          temp[c][r - 1] = -1
          board[c][r].special = 6
          board[c + 1][r].special = 0
          board[c + 2][r].special = 0
          board[c][r - 1].special = 0
          board[c][r + 1].special = 0
        }
        //     x
        // x x x
        //     x
        else if (r - 1 >= 0 && r + 1 < row && board[c][r].piece == board[c + 2][r - 1].piece && board[c][r].piece == board[c + 2][r + 1].piece) {
          temp[c][r] = -1
          temp[c + 1][r] = -1
          temp[c + 2][r] = board[c][r].piece
          temp[c + 2][r + 1] = -1
          temp[c + 2][r - 1] = -1
          board[c][r].special = 0
          board[c + 1][r].special = 0
          board[c + 2][r].special = 6
          board[c + 2][r - 1].special = 0
          board[c + 2][r + 1].special = 0
        }
        // x x x
        //   x
        //   x
        else if (r + 2 < row && board[c][r].piece == board[c + 1][r + 1].piece && board[c][r].piece == board[c + 1][r + 2].piece) {
          temp[c][r] = -1
          temp[c + 1][r] = board[c][r].piece
          temp[c + 2][r] = -1
          temp[c + 1][r + 1] = -1
          temp[c + 1][r + 2] = -1
          board[c][r].special = 0
          board[c + 1][r].special = 6
          board[c + 2][r].special = 0
          board[c + 1][r + 1].special = 0
          board[c + 1][r + 2].special = 0
        }
        //   x
        //   x
        // x x x
        else if (r - 2 >= 0 && board[c][r].piece == board[c + 1][r - 1].piece && board[c][r].piece == board[c + 1][r - 2].piece) {
          temp[c][r] = -1
          temp[c + 1][r] = board[c][r].piece
          temp[c + 2][r] = -1
          temp[c + 1][r - 1] = -1
          temp[c + 1][r - 2] = -1
          board[c][r].special = 0
          board[c + 1][r].special = 6
          board[c + 2][r].special = 0
          board[c + 1][r - 1].special = 0
          board[c + 1][r - 2].special = 0
        }
        else {
          temp[c][r] = -1
          temp[c + 1][r] = -1
          temp[c + 2][r] = -1
        }
      }
    }
  }

  var consecutiveBool = false
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (temp[c][r] != -2) {
        consecutiveBool = true
        board[c][r].piece = temp[c][r]
      }
    }
  }

  if (consecutiveBool) {
    consecutive = true
  }

  return consecutiveBool
}  

// Async function to use await
async function moveFunc() {
  // Remove event listener when the pieces are moving
  document.removeEventListener("click", clicked)
  // While loop checks for chain reactions
  while (checkConsecutive()) {
    // Move down one row every 500 milliseconds
    while (checkMove2()) {
      for (let i = 0; i < 8; i++) {
        await sleep(sleepTime)
        moveAnimation()
        updateBoard()
      }
      
      for (let c = 0; c < col; c++) {
        for (let r = 0; r < row; r++) {
          pieceOffsetUp[c][r] = 0
        }
      }

      await sleep(sleepTime)

      moveDownOne()
      updateBoard()
    }
    await sleep(sleepTime)
  }
  document.addEventListener("click", clicked, false);
}

// Not using anymore
// Using moveFunc instead
function moveDown() {
  for (let c = 0; c < col; c++) {
    var index = 0
    var temp = []
    for (let r = 0; r < row; r++) {
      if (board[c][r].piece != -1) {
        temp[index] = board[c][r].piece
        index++
      }
    }
    for (let r = 0; r < row; r++) {
      board[c][r].piece = -1
    }
    for (let r = 0; r < index; r++) {
      board[c][r + row - index] = temp[r]
    }
  }
}

// Moves down by once
function moveDownOne() {
  for (let c = 0; c < col; c++) {
    var empty = false
    var temp = new Array(row)
    var index = row - 1
    for (let r = 0; r < row; r++) {
      temp[r] = {piece: 0, special: 0}
    }
    // Delete one empty element (-1) from each empty range
    for (let r = row - 1; r > -1; r--) {
      if (!empty && board[c][r].piece == -1) {
        empty = true
      }
      else if (empty && board[c][r].piece == -1) {
        temp[index].piece = -1
        temp[index].special = 0
        index--
      }
      else if (!empty && board[c][r].piece != -1) {
        temp[index].piece = board[c][r].piece
        temp[index].special = board[c][r].special
        index--
      }
      else if (empty && board[c][r].piece != -1) {
        temp[index].piece = board[c][r].piece
        temp[index].special = board[c][r].special
        index--
        empty = false
      }
    }
    for (let r = row - 1; r > -1; r--) {
      board[c][r].piece = -1
      board[c][r].special = 0
    }
    for (let r = row - 1; r > index; r--) {
      board[c][r].piece = temp[r].piece
      board[c][r].special = temp[r].special
    }

    // Add random piece to the top
    if (board[c][0].piece == -1) {
      board[c][0].piece = Math.floor(6 * Math.random())
    }
  }
}

function moveAnimation() {
  for (let c = 0; c < col; c++) {
    var index = -1
    for (let r = row - 1; r > -1; r--) {
      if (board[c][r].piece == -1) {
        index = r
        break
      }
    }
    for (let r = index; r > -1; r--) {
      if (board[c][r].piece != -1) {
        pieceOffsetUp[c][r] += 5
      }
    }
  }
}

// Not using anymore
// Using checkMove2 instead
function checkMove1() {
  var needMove = false
  for (let c = 0; c < col; c++) {
    var r = 0
    while (board[c][r].piece == -1 && r < row) {
      r++;
    }
    while (r < row) {
      if (board[c][r].piece == -1) {
        needMove = true
        break;
      }
      r++;
    }
  }
  return needMove
}

// Checks if still need to move pieces
function checkMove2() {
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r].piece == -1) {
        return true
      }
    }
  }
  return false
}

// Not using anymore
// Using an iterative method instead
function moveRecursive() {
  if (checkMove2()) {
    setTimeout(function() {
      moveRecursive()
      updateBoard()
      moveDownOne()
    }, 500)
  }
}

// Draws a box around the piece clicked to highlight it
function highlight(pieceC, pieceR) {
  ctx.lineWidth = 2
  ctx.strokeRect(gridOffsetLeft + imageW * pieceC + padding * pieceC, gridOffsetUp + imageH * pieceR + padding * pieceR, imageW, imageH)
}

// Not using anymore
// Only used for puzzle version
function checkWin(board) {
  var empty = true
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (board[c][r].piece != -1) {
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
// Alternative to setTimeout
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}