var n = 100;
var matrix;
var speed;
var running = false;
var startState;
var furthest = {
    row: 0,
    col: 0
}

$(document).ready(function(){
    window.matrix = new Array(n).fill(false)
        .map(() => new Array(Math.ceil(n)).fill(false));
    generateTable();
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rangeSlideSpeed(value) {
    document.getElementById('rangeValueSpeed').innerHTML = "Speed: " + value + "%";
    window.speed = value;
}

function rangeSlideSize(value) {
    document.getElementById('rangeValueSize').innerHTML = "Block Size: " + value;
    document.getElementById("tableMain").style.transform = 'scale('+ value +')'
}

function saveStartState(){
  window.startState = []

  for (var i = 0; i < window.matrix.length; i++){
    for (var j = 0; j < window.matrix[i].length; j++){
      if (window.matrix[i][j]){
        window.startState.push({row: i, col: j});
      }
    }
  }
}

function start(){
    saveStartState();
    running = true;
    loop();
}

function stop(){
    running = false;
}

function reset(){
  clearAll();
  for (let block of window.startState){
    window.matrix[block.row][block.col] = true;
    document.getElementById(block.row + '_'+ block.col).classList.add("alive");
  }
}

function clearAll(){
    window.running = false;
    window.matrix = new Array(n).fill(false) 
        .map(() => new Array(Math.ceil(n)).fill(false));
    
    for (var i = 0; i < window.matrix.length; i++){
        for (var j = 0; j < window.matrix[i].length; j++){

            var el = document.getElementById(i +'_'+ j)
            if (el.classList.contains('alive')){
                el.classList.remove('alive');
            }
        }
    }
}

function setFurthest(row, col){
    if (row > furthest.row){
        furthest.row = row
    }
    if (col > furthest.col){
        furthest.col = col
    }
}

function generateTable(){
    var table = document.getElementById("tableMain");

    for (var i = 0; i < window.matrix.length; i++){
        var r = document.createElement("tr");

        for (var j = 0; j < window.matrix[i].length; j++){

            var c = document.createElement("td");
            c.classList.add('cell');
            c.id = i + '_' + j
            c.onclick = function(){
                var row = parseInt(this.id.split('_')[0])
                var col = parseInt(this.id.split('_')[1])

                window.matrix[row][col] = !window.matrix[row][col];
                if(window.matrix[row][col]){
                    setFurthest(row, col);
                }
                this.classList.toggle('alive')
            };
            r.appendChild(c)
        }
        table.appendChild(r);
    }
}

function getLiveNeighbors(row, column) {

    var liveNeighbors = 0;

    if (row < 3 || row > n-3 || column < 3 || column > n-3 ){
      return liveNeighbors;
    }

    for (let i = row-1; i <= row+1; i++ ){
      for (let j = column-1; j <= column+1; j++){
        if (i == row && j == column){
          continue;
        } else {
          if (window.matrix[i][j]){
            liveNeighbors++;
          }
        }
      }
    }

    return liveNeighbors;
}




async function loop(){

    var changesMade = true;

    while (changesMade && this.running){
      var nextGen = new Array(n).fill(false)
      .map(() => new Array(n).fill(false));

      var changeArr = []

      var liveNeighbors;

      for (let i = 0; i < furthest.row + 3; i++){
        for (let j = 0; j < furthest.col + 3; j++){ 
          liveNeighbors = getLiveNeighbors(i, j);
          if (window.matrix[i][j]){
            if (liveNeighbors == 2 || liveNeighbors == 3){
              nextGen[i][j] = true;
              setFurthest(i, j);
              changeArr.push([i,j]);
            } else {
              nextGen[i][j] = false;
              setFurthest(i, j);
              changeArr.push([i,j]);
            }
          } else {
            if (liveNeighbors == 3){
              nextGen[i][j] = true;
              setFurthest(i, j);
              changeArr.push([i,j]);
            }
          }
        }
      }

      var changeCount = 0;

      for (let change of changeArr){
        if (nextGen[change[0]][change[1]] != window.matrix[change[0]][change[1]]){
            changeCount++;
            window.matrix[change[0]][change[1]] = !window.matrix[change[0]][change[1]]
            document.getElementById(change[0] +'_'+ change[1]).classList.toggle('alive');
        }
      }

      changesMade = changeCount > 0;

      await sleep((101-window.speed)*10);
    }

    running = false;
}
