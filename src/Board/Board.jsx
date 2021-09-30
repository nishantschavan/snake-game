import React,{useState,useEffect} from 'react';
import './Board.css';

class LinkedListNode{
    constructor(value){
        this.value=value;
        this.next=null;
    }
}

class LinkedList{
    constructor(value){
        const node= new LinkedListNode(value);
        this.head=node;
        this.tail=node;
    }
}

const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    LEFT:'LEFT',
    DOWN:'DOWN'
};

const BOARD_SIZE = 10;
const PROBABILITY_OF_DIRECTION_OF_REVERSAL=0.3;

const getStartingSnakeLLValue = (board)=>{
    const rowSize= board.length;
    const colSize= board[0].length;
    const startingRow = Math.round(rowSize/3);
    const startingCol = Math.round(colSize/3);
    const startingCell = board[startingRow][startingCol];
    return {
        row:startingRow,
        col:startingCol,
        cell:startingCell
    };
};

const Board=() => {

    const [score,setScore] = useState(0);
    const [board,setBoard] = useState(
        // new Array(BOARD_SIZE).fill(0).map(row => new Array(BOARD_SIZE).fill(0))
        createBoard(BOARD_SIZE)
    );
    const [snake,setSnake] = useState(new LinkedList(getStartingSnakeLLValue(board)));
    const [snakeCells,setSnakeCells] = useState(new Set([snake.head.value.cell]));
    
    const [foodCell,setFoodCell] = useState(snake.head.value.cell + 5);
    const [direction,setDirection] = useState(Direction.RIGHT);
    const [foodShouldReverseDirection,setFoodShouldReverseDirection] = useState(false);
    
    useEffect(() => {
        
        window.addEventListener('keydown',e=>{
            
        })
    }, [])

    const handlekeydown = e =>{
        const newDirection = getDirectionFromKey(e.key);
        const isValidDirection = newDirection !== '';
        if(!isValidDirection) return;
        const snakeWillRunIntoItself =
            getOppositeDirection(newDirection) === direction && snakeCells.size > 1;

        if(snakeWillRunIntoItself) return;
        setDirection(newDirection);
    }

    const moveSnake =()=>{
        const currHeadcoords = {
            row:snake.head.value.row,
            col:snake.head.value.col
        }

        const nextHeadCoords = getCoordsInDirection(currHeadcoords,direction);
        if(isOutOfBounds(nextHeadCoords,board)){
            return;
        }
        const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
        if (snakeCells.has(nextHeadCell)) {    // need to verify
            handleGameOver();
            return;
        }

        const newHead = LinkedList({
            row:newHeadCoords.row,
            col:newHeadCoords.col,
            cell:newHeadCell,
        })
        const currHead = snake.head;
        snake.head = newHead;
        currHead.next = newHead;

        
      
    }

    return (
        <div className="board">
            {board.map((row,rowIdx) => (
                <div key={rowIdx} className="row">
                    {row.map((cellValue,cellIdx)=>(
                        <div 
                            key={cellIdx} 
                            className={`cell ${snakeCells.has(cellValue) ? 'snake-cell':''}`}>
                                {cellValue}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const createBoard = BOARD_SIZE =>{
    let counter=1;
    const board = [];
    for(let row=0;row<BOARD_SIZE;row++){
        const countRow = [];
        for(let col=0;col<BOARD_SIZE;col++){
            countRow.push(counter++);
        }
        board.push(countRow);
    }
    return board;
};

const getDirectionFromKey = key =>{
    if(key=='ArrowUp') return Direction.UP;
    if(key=='ArrowDown') return Direction.DOWN;
    if(key=='ArrowLeft') return Direction.LEFT;
    if(key=='ArrowRight') return Direction.RIGHT;
    return '';
};

const getCellClassName = (
    cellValue,
    foodCell,
    foodShouldReverseDirection,
    snakeCells
)=>{
    let className='cell';
    if(cellValue==foodCell){
        if(foodShouldReverseDirection){
            className='cell cell-purple';
        }
        else{
            className='cell cell-red';
        }
    }
    if(snakeCells.has(cellValue)) className='cell cell-green';

    return className;
};

export default Board;
