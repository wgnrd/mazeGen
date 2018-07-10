let currentCell;
let cellStack;
let mazeStack;
let width;
let height;

const generateTable = () => {
  for (i = 1; i <= 3; i++) {
    let maze = document.querySelector(`#mazeL${i}`);
    if (maze.hasChildNodes) maze.innerHTML = '';

    for (x = 0; x < width; x++) {
      let row = document.createElement('tr');
      for (y = 0; y < height; y++) {
        let cell = document.createElement('td');
        cell.id = `c${x}c${y}c${i - 1}`;
        row.appendChild(cell);
      }
      maze.appendChild(row);
    }
  }
};

class Cell {
  constructor(xPosition, yPosition, zPosition) {
    this.ID = Math.random()
      .toString(36)
      .substr(2, 9);
    this.x = xPosition;
    this.y = yPosition;
    this.z = zPosition;
    this.borderUp = true;
    this.borderDown = true;
    this.borderLeft = true;
    this.borderRight = true;
    this.borderZUp = true;
    this.borderZDown = true;
    this.isVisited = false;
  }
}

const cellHasNeighbours = ({ x, y, z }) => {
  let neighbours = false;
  if (x > 0) neighbours = neighbours || !cellStack[x - 1][y][z].isVisited;
  if (y > 0) neighbours = neighbours || !cellStack[x][y - 1][z].isVisited;
  if (z > 0) neighbours = neighbours || !cellStack[x][y][z - 1].isVisited;
  if (x < width - 1) neighbours = neighbours || !cellStack[x + 1][y][z].isVisited;
  if (y < height - 1) neighbours = neighbours || !cellStack[x][y + 1][z].isVisited;
  if (z < 2) neighbours = neighbours || !cellStack[x][y][z + 1].isVisited;
  return neighbours;
};

//TODO
const chooseNeighbour = ({ x, y, z }) => {
  let chosenCells = [];
  if (x > 0 && !cellStack[x - 1][y][z].isVisited) {
    chosenCells.push(cellStack[x - 1][y][z]);
  }
  if (y > 0 && !cellStack[x][y - 1][z].isVisited) {
    chosenCells.push(cellStack[x][y - 1][z]);
  }
  if (x < width - 1 && !cellStack[x + 1][y][z].isVisited) {
    chosenCells.push(cellStack[x + 1][y][z]);
  }
  if (y < height - 1 && !cellStack[x][y + 1][z].isVisited) {
    chosenCells.push(cellStack[x][y + 1][z]);
  }
  if (z > 0 && !cellStack[x][y][z - 1].isVisited) {
    chosenCells.push(cellStack[x][y][z - 1])
  }
  if (z < 2 && !cellStack[x][y][z + 1].isVisited) {
    chosenCells.push(cellStack[x][y][z + 1])
  }
  const random = Math.floor(Math.random() * chosenCells.length - 1) + 1;
  return chosenCells[random];
};

const setCurrentCell = cell => {
  if (currentCell) {
    var oldCell = document
      .querySelector(`#c${currentCell.x}c${currentCell.y}c${currentCell.z}`)
    oldCell.classList.add('wasVisited');
    oldCell.classList.remove('currentCell');
  }
  currentCell = cell;

  const { x, y, z } = cell;
  document.querySelector(`#c${x}c${y}c${z}`).classList.add('currentCell');
};

const pushCellToStack = cell => {
  mazeStack.push(cell);
};

const popCellFromStack = () => {
  return mazeStack.pop();
};

const removeWall = (sourceCell, targetCell) => {
  const sourceX = sourceCell.x;
  const sourceY = sourceCell.y;
  const sourceZ = sourceCell.z;
  const targetX = targetCell.x;
  const targetY = targetCell.y;
  const targetZ = targetCell.z;
  const sourceCellCss = document.querySelector(`#c${sourceX}c${sourceY}c${sourceZ}`);
  const targetCellCss = document.querySelector(`#c${targetX}c${targetY}c${targetZ}`);

  if (sourceX > targetX) {
    cellStack[sourceX][sourceY][sourceZ].borderUp = false;
    cellStack[targetX][targetY][sourceZ].borderDown = false;
    sourceCellCss.style.borderTop = 'none';
    targetCellCss.style.borderBottom = 'none';
    //remove source Up
    // remove target down
  } else if (sourceX < targetX) {
    cellStack[sourceX][sourceY][sourceZ].borderDown = false;
    cellStack[targetX][targetY][sourceZ].borderUp = false;
    sourceCellCss.style.borderBottom = 'none';
    targetCellCss.style.borderTop = 'none';
    //remove target UP
    // remove sourceDown
  }
  if (sourceY > targetY) {
    cellStack[sourceX][sourceY][sourceZ].borderLeft = false;
    cellStack[targetX][targetY][sourceZ].borderRight = false;
    sourceCellCss.style.borderLeft = 'none';
    targetCellCss.style.borderRight = 'none';
    //remove target left
    //remove source right
  } else if (sourceY < targetY) {
    cellStack[sourceX][sourceY][sourceZ].borderRight = false;
    cellStack[targetX][targetY][sourceZ].borderLeft = false;

    sourceCellCss.style.borderRight = 'none';
    targetCellCss.style.borderLeft = 'none';
    //remove target right
    //remove source right
  }

  if (sourceZ > targetZ) {
    cellStack[sourceX][sourceY][sourceZ].borderZDown = false;
    cellStack[targetX][targetY][targetZ].borderZUp = false;
    sourceCellCss.classList.add('fas', 'fa-caret-down', 'fa-xs');
    targetCellCss.classList.add('fas', 'fa-caret-up', 'fa-xs');

  } else if (sourceZ < targetZ) {
    cellStack[sourceX][sourceY][sourceZ].borderZUp = false;
    cellStack[targetX][targetY][sourceZ].borderZDown = false;

    sourceCellCss.classList.add('fas', 'fa-caret-up', 'fa-xs');
    targetCellCss.classList.add('fas', 'fa-caret-down', 'fa-xs');


  }
};

const areUnivisitedCells = () => {
  return (
    cellStack.filter(rows => rows.filter(cell => cell.isVisited === false))
      .length !== 0
  );
};

const InitCells = (width, height) => {
  let stack = [];
  for (x = 0; x < width; x++) {
    stack[x] = [];
    for (y = 0; y < height; y++) {
      stack[x][y] = [];
      for (z = 0; z < 3; z++) {
        stack[x][y][z] = new Cell(x, y, z);
      }
    }
  }
  return stack;
};

const main = (size, timeOut) => {
  width = size;
  height = size;
  generateTable();
  cellStack = InitCells(width, height);
  mazeStack = [];

  setCurrentCell(cellStack[0][0][0]);
  currentCell.isVisited = true;

  let count = 1;
  (function myLoop(i) {
    setTimeout(() => {
      if (cellHasNeighbours(currentCell)) {

        const nextCell = chooseNeighbour(currentCell);
        pushCellToStack(currentCell);
        removeWall(currentCell, nextCell);
        nextCell.isVisited = true;
        setCurrentCell(nextCell);
      } else {
        const backTraceCell = popCellFromStack();
        setCurrentCell(backTraceCell);
      }
      count++;
      if (--i) myLoop(i);
    }, timeOut);
  })(2 * 3 * (width * height));
};

const onRefresh = () => {
  const refwidth = parseInt(document.querySelector('#gridSize').value);
  const reftimeOut = parseInt(document.querySelector('#gridTimeout').value);
  main(refwidth, reftimeOut);
};

window.onload = () => {
  main(10, 50);
};
