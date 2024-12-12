var board = [];
var rows = 5;
var cols = 5;

var minesRandom = Math.floor(Math.random() * rows * 2);
var minesCount = minesRandom;
var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

let mineAudio = new Audio("../MineSweeper/Audio/distant-explosion-47562.mp3");
let mineMusic = new Audio("../MineSweeper/Audio/minesweepermusic.mp3");
mineMusic.loop = true;

window.onload = function(){
    startGame();
}

function setMines(){
    let minesLeft = minesCount;
    while(minesLeft > 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();

        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame(){
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for(let r = 0; r < rows; r++){
        let row = []
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);  
    }
    console.log(board);  
}

function setFlag(){
    if(flagEnabled){
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
        document.getElementById("flag-button").innerText = "🚩 Off";
    }else{
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "gray";
        document.getElementById("flag-button").innerText = "🚩 On";
    }
}

function displayImage(){
    var img = document.createElement("img");
    img.src = "../MineSweeper/Images/minesweeper.jpg";
    img.width = 48;
    img.height = 48;
    
    var image = document.body.appendChild(img);
}

function clickTile(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }

    let tile = this;
    if(flagEnabled){
        if(tile.innerText == ""){
            tile.innerText = "🚩";
        }else if(tile.innerText == "🚩"){
            tile.innerText = "";
        }
        return;
    }

    if(minesLocation.includes(tile.id)){
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r,c);
}

function revealMines(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let tile = board[r][c];
                
            if(minesLocation.includes(tile.id)){
                tile.innerText = "💣";
                mineMusic.pause();
                mineAudio.play();
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c){
    if(r<0 || r >= rows || c <0 || c >= cols){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
            return;
    }

    board[r][c].classList.add("tile-clicked");

    tilesClicked += 1; 
    mineMusic.play();

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1);  //top left
    minesFound += checkTile(r-1, c);    //top
    minesFound += checkTile(r-1, c+1);  //top right

    minesFound += checkTile(r, c-1);    //left
    minesFound += checkTile(r, c+1);    //right

    minesFound += checkTile(r+1, c-1);  //bott left
    minesFound += checkTile(r+1, c);    //bott
    minesFound += checkTile(r+1, c+1);  //bott right

    if(minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString()); 
    }else{
        checkMine(r-1, c-1);  //top left
        checkMine(r-1, c);    //top
        checkMine(r-1, c+1);  //top right

        checkMine(r, c-1);    //left
        checkMine(r, c+1);    //right

        checkMine(r+1, c-1);  //bott left
        checkMine(r+1, c);    //bott
        checkMine(r+1, c+1);  //bott right
    }

    if(tilesClicked == rows * cols - minesCount){
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c){
    if(r<0 || r >= rows || c <0 || c >= cols){
        return 0;
    }
    if(minesLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}