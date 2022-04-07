let currentCell;
let cellStack;
let mazeStack;
let width;
let height;

const generateTable = () => {
  let maze = document.querySelector('#maze');
  if (maze.hasChildNodes) maze.innerHTML = '';

  for (x = 0; x < width; x++) {
    let row = document.createElement('tr');
    for (y = 0; y < height; y++) {
      let cell = document.createElement('td');
      cell.id = `c${x}c${y}`;
      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
};

class Cell {
  constructor(xPosition, yPosition) {
    this.ID = Math.random()
      .toString(36)
      .substr(2, 9);
    this.x = xPosition;
    this.y = yPosition;
    this.borderUp = true;
    this.borderDown = true;
    this.borderLeft = true;
    this.borderRight = true;
    this.isVisited = false;
  }
}

const cellHasNeighbours = ({ x, y }) => {
  let neighbours = false;
  if (x > 0) neighbours = neighbours || !cellStack[x - 1][y].isVisited;
  if (y > 0) neighbours = neighbours || !cellStack[x][y - 1].isVisited;
  if (x < width - 1) neighbours = neighbours || !cellStack[x + 1][y].isVisited;
  if (y < height - 1) neighbours = neighbours || !cellStack[x][y + 1].isVisited;
  return neighbours;
};


const chooseNeighbour = ({ x, y }) => {
  let chosenCell = [];
  if (x > 0 && !cellStack[x - 1][y].isVisited) {
    chosenCell.push(cellStack[x - 1][y]);
  }
  if (y > 0 && !cellStack[x][y - 1].isVisited) {
    chosenCell.push(cellStack[x][y - 1]);
  }
  if (x < width - 1 && !cellStack[x + 1][y].isVisited) {
    chosenCell.push(cellStack[x + 1][y]);
  }
  if (y < height - 1 && !cellStack[x][y + 1].isVisited) {
    chosenCell.push(cellStack[x][y + 1]);
  }
  const random = Math.floor(Math.random() * chosenCell.length - 1) + 1;
  return chosenCell[random];
};

const setCurrentCell = cell => {
  if (currentCell) {
    document
      .querySelector(`#c${currentCell.x}c${currentCell.y}`)
      .setAttribute('class', 'wasVisited');
  }
  currentCell = cell;

  const { x, y } = cell;
  document.querySelector(`#c${x}c${y}`).setAttribute('class', 'currentCell');
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
  const targetX = targetCell.x;
  const targetY = targetCell.y;
  const sourceCellCss = document.querySelector(`#c${sourceX}c${sourceY}`);
  const targetCellCss = document.querySelector(`#c${targetX}c${targetY}`);

  if (sourceX > targetX) {
    cellStack[sourceX][sourceY].borderUp = false;
    cellStack[targetX][targetY].borderDown = false;
    sourceCellCss.style.borderTop = 'none';
    targetCellCss.style.borderBottom = 'none';
    //remove source Up
    // remove target down
  } else if (sourceX < targetX) {
    cellStack[sourceX][sourceY].borderDown = false;
    cellStack[targetX][targetY].borderUp = false;
    sourceCellCss.style.borderBottom = 'none';
    targetCellCss.style.borderTop = 'none';
    //remove target UP
    // remove sourceDown
  }
  if (sourceY > targetY) {
    cellStack[sourceX][sourceY].borderLeft = false;
    cellStack[targetX][targetY].borderRight = false;
    sourceCellCss.style.borderLeft = 'none';
    targetCellCss.style.borderRight = 'none';
    //remove target left
    //remove source right
  } else if (sourceY < targetY) {
    cellStack[sourceX][sourceY].borderRight = false;
    cellStack[targetX][targetY].borderLeft = false;

    sourceCellCss.style.borderRight = 'none';
    targetCellCss.style.borderLeft = 'none';
    //remove target right
    //remove source right
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
      stack[x][y] = new Cell(x, y);
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

  setCurrentCell(cellStack[0][0]);
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
  })(2 * (width * height - 1));
};

const onRefresh = () => {
  const refwidth = parseInt(document.querySelector('#gridSize').value);
  const reftimeOut = parseInt(document.querySelector('#gridTimeout').value);
  main(refwidth, reftimeOut);
};

window.onload = () => {
  main(20, 50);
};
