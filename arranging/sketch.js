let board = [];
let n = 2;
let button;
let gameState = "play";
let timer = 0;
let moves = 0;

function displayDuringGameCanvas() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 0) continue;
            let topLeftCornerY = 50+(300/n)*i+65;
            let topLeftCornerX = 50+(300/n)*j;
            fill("blue");
            rect(topLeftCornerX, topLeftCornerY, 300/n, 300/n);
            fill("white");
            text(board[i][j], topLeftCornerX+150/n, topLeftCornerY+150/n);
        }
    }

    fill("black");
    text("Time: " + Math.floor(timer/60) + " secs      Moves: " + moves, 200, 85);
}

function displayWonCanvas() {
    // display board
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 0) continue;
            let topLeftCornerY = 50+(300/n)*i+140;
            let topLeftCornerX = 50+(300/n)*j;
            fill("blue");
            rect(topLeftCornerX, topLeftCornerY, 300/n, 300/n);
            fill("white");
            text(board[i][j], topLeftCornerX+150/n, topLeftCornerY+150/n);
        }
    }

    fill(Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
    text("Congratulations you won!", 200, 85);
    fill("black");
    text("You did it in " + Math.floor(timer/60) + " secs with " + moves + " moves", 200, 120);
    text("Your speed was " + Math.round(moves*1000*60/timer)/1000 + " moves/sec", 200, 155);
}

function setup() {
    let Canvas = createCanvas(400, 530);
    Canvas.position((windowWidth-400)/2, 250);
    
    textAlign(CENTER, CENTER);
    createBoard();

    button = createButton("New Game");
    button.mouseClicked(recreateBoard);
    button.size(83,21);
    button.position(windowWidth/2+50, 289);

    sel = createSelect();
    sel.option(2);
    sel.option(3);
    sel.option(4);
    sel.option(5);
    sel.option(6);
    sel.changed(changeN);
    sel.position(windowWidth/2, 290);
}

function draw() {
    background(157, 217, 210);
    fill("black");
    textSize(18);
    text("Choose Level:", 110, 50);
    textSize(24);
    if (gameState === "play") {
        displayDuringGameCanvas();
        timer++;
    }
    if (gameState === "end") displayWonCanvas();
}

function createBoard() {
    timer = 0;
    moves = 0;
    gameState = "play";

    board = [];
    for (let i = 0; i < n; i++) {
        board.push([]);
        for (let j = 0; j < n; j++) {
            board[i].push((i*n+j+1)%(n*n));
        }
    }
    
    let step = 1000;
    let currentX = n-1;
    let currentY = n-1;
    while (step > 0) {
        let switchStep = Math.floor(Math.random()*4);
        
        if (switchStep === 0) {
            if (currentX === 0) continue;
            board[currentY][currentX] = board[currentY][currentX-1];
            board[currentY][currentX-1] = 0;
            currentX--;
        } if (switchStep === 1) {
            if (currentX === n-1) continue;
            board[currentY][currentX] = board[currentY][currentX+1];
            board[currentY][currentX+1] = 0;
            currentX++;
        } if (switchStep === 2) {
            if (currentY === 0) continue;
            board[currentY][currentX] = board[currentY-1][currentX];
            board[currentY-1][currentX] = 0;
            currentY--;
        } if (switchStep === 3) {
            if (currentY === n-1) continue;
            board[currentY][currentX] = board[currentY+1][currentX];
            board[currentY+1][currentX] = 0;
            currentY++;
        }
        step--;
    }
}

function recreateBoard() {
    createBoard();
}

function changeN(){
    n = sel.value();
    createBoard();
}

function mouseClicked() {
    if (gameState === "end") return;

    let clickedPosition;
    let found = false;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 0) continue;
            let topLeftCornerY = 50+(300/n)*i+65;
            let topLeftCornerX = 50+(300/n)*j;
            if (mouseX > topLeftCornerX && mouseX < topLeftCornerX + 300/n) {
                if (mouseY > topLeftCornerY && mouseY < topLeftCornerY + 300/n) {
                    clickedPosition = i*10+j;
                    found = true;
                }
            }
        }
    }
    if (!found) return;

    let row = Math.floor(clickedPosition/10);
    let col = clickedPosition%10;
    let moved = false;
    for (let i = 0; i < n; i++) {
        if (board[row][i] === 0) {
            moved = true;
            if (col > i) for (let j = i; j < col; j++) {
                board[row][j] = board[row][j+1];
            } if (col < i) for (let j = i; j > col; j--) {
                board[row][j] = board[row][j-1];
            } board[row][col] = 0;
            break;
        }
    }
    for (let i = 0; i < n; i++) {
        if (board[i][col] === 0) {
            moved = true;
            if (row > i) for (let j = i; j < row; j++) {
                board[j][col] = board[j+1][col];
            } if (row < i) for (let j = i; j > row; j--) {
                board[j][col] = board[j-1][col];
            } board[row][col] = 0;
            break;
        }
    }

    if (moved) moves++;
    gameEnded();
}

function gameEnded() {
    let won = true;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === n-1 && j === n-1) {
                if (board[i][j] != 0) won = false;
            } else {
                if (board[i][j] != i*n+j+1) won = false;
            }
        }
    }
    if (won) gameState = "end";
}