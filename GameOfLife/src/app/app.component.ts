import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GameOfLife';
  n = 120;

  matrix = null;
  nextGen = null;


  furthest = {
    row: 0,
    column: 0
  }
  running = false;

  constructor() {

    this.matrix = new Array(this.n).fill(false)
      .map(() => new Array(this.n).fill(false));
  }

  public async loop(){

    var changesMade = true;

    while (changesMade && this.running){
      var nextGen = new Array(this.n).fill(false)
      .map(() => new Array(this.n).fill(false));

      var changeArr = []

      var liveNeighbors;

      for (let i = 0; i < this.furthest.row + 3; i++){
        for (let j = 0; j < this.furthest.column + 3; j++){ 
          liveNeighbors = this.getLiveNeighbors(i, j);
          if (this.matrix[i][j]){
            if (liveNeighbors == 2 || liveNeighbors == 3){
              nextGen[i][j] = true;
              this.setFurthest(i, j);
              changeArr.push([i,j]);
            } else {
              nextGen[i][j] = false;
              this.setFurthest(i, j);
              changeArr.push([i,j]);
            }
          } else {
            if (liveNeighbors == 3){
              nextGen[i][j] = true;
              this.setFurthest(i, j);
              changeArr.push([i,j]);
            }
          }
        }
      }

      var changeCount = 0;

      for (let change of changeArr){
        if (nextGen[change[0]][change[1]] != this.matrix[change[0]][change[1]]){
          changeCount++;
        }
      }

      changesMade = changeCount > 0;

      await this.sleep(10);

      this.matrix = nextGen;
    }

    this.running = false;
  }

  public getLiveNeighbors(row, column): Number {

    //Going to have to handle edge of table here at some point

    var liveNeighbors = 0;

    if (row < 3 || row > this.n-3 || column < 3 || column > this.n-3 ){
      return liveNeighbors;
    }

    for (let i = row-1; i <= row+1; i++ ){
      for (let j = column-1; j <= column+1; j++){
        if (i == row && j == column){
          continue;
        } else {
          if (this.matrix[i][j]){
            liveNeighbors++;
          }
        }
      }
    }

    return liveNeighbors;
  }

  public setFurthest(row, column){
    if (row > this.furthest.row){
      this.furthest.row = row
    }

    if (column > this.furthest.column){
      this.furthest.column = column
    }
  }

  public sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public clear(){
    this.matrix = new Array(this.n).fill(false)
      .map(() => new Array(this.n).fill(false));
  }

}