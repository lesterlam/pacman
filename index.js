const width = 28;
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const squares = [];
const directions = [1, -1, width, -width];
let locPacman = 490;
let myScore = 0;

//28 * 28 = 784
  // 0 - pac-dot
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty

const layout = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
  1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
  1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
  1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
  1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
  4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
  1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
  1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
  1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
  1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
  1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
  1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
  1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
  1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

// create board
function createBoard() {
  for (i = 0; i < layout.length; i++) {
    const square = document.createElement('div');
    switch(layout[i]) {
      case 0:
        square.classList.add('pac-dot');
        break;
      case 1:
        square.classList.add('wall');
        break;
      case 2:
        square.classList.add('ghost-lair');
        break;
      case 3:
        square.classList.add('power-pellet');
        break;
    }
    grid.appendChild(square);
    squares.push(square);
  }

  // setup pacman on board
  squares[locPacman].classList.add('pacman');

  // setup ghosts on board
  ghosts.forEach(g => {
    squares[g.currentIndex].classList.add(g.name);
    squares[g.currentIndex].classList.add('ghost');

    g.timerId = setInterval(() => {
      // get all the available moves
      let ghostDirections = getGhostDirections(g);

      // check if available direction is not empty
      if (ghostDirections.length > 0) {
        // pick one of the available directions
        let d  = ghostDirections[Math.floor(Math.random() * ghostDirections.length)];
        to = g.currentIndex + d;

        //remove ghost from current index
        squares[g.currentIndex].classList.remove(g.name);
        squares[g.currentIndex].classList.remove('ghost');

        //update ghost current and previous index
        g.prevIndex = g.currentIndex;
        g.currentIndex += d;

        //add ghost to new index
        squares[g.currentIndex].classList.add(g.name);
        squares[g.currentIndex].classList.add('ghost');
      } else {
        //stay at the same place and update previous index
        g.prevIndex = g.currentIndex;
      }


    }, g.speed);
  })
  // console.log(squares);
}

// check whether it is valid ghost move
function checkGhostMove(c, d) {
  let to = c + d;
  if (
    !squares[to].classList.contains('wall') &&
    !squares[to].classList.contains('ghost') &&
    !(to % width === 0 && d === 1) &&
    !((to + 1) % width === 0 && d === -1) &&
    !(to <= 0) && !(to >= squares.length)
  ) return true;
  else return false;
}

// get ghost available directions
function getGhostDirections(g) {
  let ghostDirections = [];
  directions.forEach( d => {
    if (g.currentIndex + d !== g.prevIndex &&
      checkGhostMove(g.currentIndex, d)) {
        ghostDirections.push(d)
    }
  })
  return ghostDirections
}

// get next position
function getNextPosition(e) {
  let to;
  let from = locPacman;
  switch(e.key) {
    case "ArrowUp":
      to = from - width;
      break;
    case "ArrowDown":
      to = from + width;
      break;
    case "ArrowLeft":
      if (from % width === 0) {
        from += width;
      }
      to = from - 1;
      break;
    case "ArrowRight":
        if ((from + 1) % width === 0) {
          from -= width;
        }
      to = from + 1;
      break;
  }

  if (to < 0 ||
      to > squares.length ||
      squares[to].classList.contains('wall') ||
      squares[to].classList.contains('ghost-lair')) {
    return locPacman;
  }

  return to;
}

// move to position
function movePacmanTo(to) {
  squares[locPacman].classList.remove('pacman');
  squares[to].classList.add('pacman');
  locPacman = to;
  if (squares[to].classList.contains('pac-dot') ||
      squares[to].classList.contains('power-pellet')) {
    squares[to].classList.remove('pac-dot');
    squares[to].classList.remove('power-pellet');
    myScore += 1;
    scoreDisplay.innerHTML = myScore;
  }
}

// control pacman
function movePacman(e) {
  movePacmanTo(getNextPosition(e));
}

// ghost class
class Ghost {
  constructor(name, startIndex, speed) {
    this.name = name;
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.prevIndex = startIndex;
    this.isScared = false;
    this.timerId = NaN;
    // this.direction = directions[Math.floor(Math.random() * directions.length)]
  }
}

// create ghosts list
const ghosts = [
  new Ghost('blinky', 348, 250),
  new Ghost('pinky', 376, 400),
  new Ghost('inky', 351, 300),
  new Ghost('clyde', 379, 500)
]

createBoard();
document.addEventListener('keyup', movePacman);
