import React, { useState } from "react";
import Board from "./Board";
import "./styles.css";
const defaultWidth = 20;
const defaultHeight = 20;
const minSize = 5;
const maxSize = 25;
const nSquareToWin = 5;
function Game(props) {
  const { firstPlayer, secondPlayer } = props;
  let tmpArr = Array(defaultHeight);
  for (let i = 0; i < defaultHeight; i++) {
    tmpArr[i] = Array(defaultWidth).fill(null);
  }
  const [inputWidth, setInputWidth] = useState(defaultWidth);
  const [inputHeight, setInputHeight] = useState(defaultHeight);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([
    {
      squares: tmpArr,
      location: null,
    },
  ]);

  const handleClick = (i, j) => {
    const tempHistory = history.slice(0, stepNumber + 1);
    const current = tempHistory[stepNumber];
    const squares = current.squares.slice();
    current.squares.map((row, idx) => {
      squares[idx] = current.squares[idx].slice();
      return true;
    });
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = xIsNext ? "X" : "O";
    setHistory(
      tempHistory.concat([
        {
          squares: squares,
          location: { x: i, y: j },
        },
      ])
    );
    setStepNumber(tempHistory.length);
    setXIsNext(!xIsNext);
  };

  const handleChangeWidth = (e) => {
    const val = Number(e.target.value);
    setInputWidth(val);
    if (val >= minSize && val <= maxSize) {
      let tmpArr = Array(height);
      for (let i = 0; i < height; i++) {
        tmpArr[i] = Array(val).fill(null);
      }

      setWidth(val);
      setHistory([
        {
          squares: tmpArr,
          location: null,
        },
      ]);
      setStepNumber(0);
      setXIsNext(true);
    }
  };
  const handleChangeHeight = (e) => {
    const val = Number(e.target.value);
    setInputHeight(val);
    if (val >= minSize && val <= maxSize) {
      let tmpArr = Array(val);
      for (let i = 0; i < val; i++) {
        tmpArr[i] = Array(width).fill(null);
      }

      setHeight(Number(val));
      setHistory([
        {
          squares: tmpArr,
          location: null,
        },
      ]);
      setXIsNext(true);
    }
  };
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);


  let status;
  if (winner) {
    let endGame = true;
    let nameWinner = '';
    
    if (winner.val === "X") {
      nameWinner = firstPlayer;
      status = "Winner: " + firstPlayer;
    } else {
      nameWinner = secondPlayer;
      status = "Winner: " + secondPlayer;
    }
    if (props.handleWin) {
      props.handleWin(endGame, nameWinner);
    }
  } else {
    status = "Next player: " + (xIsNext ? firstPlayer : secondPlayer);
  }

  return (
    <div className="content">
      <div className="game-config">
        <span className="fixed-size">Width:</span>
        <input
          type="number"
          placeholder="Width"
          value={inputWidth}
          onChange={handleChangeWidth}
        />
        <br />
        <span className="fixed-size">Height:</span>
        <input
          type="number"
          placeholder="Height"
          value={inputHeight}
          onChange={handleChangeHeight}
        />
      </div>
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => handleClick(i, j)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div style={{color:'red',fontSize:20, fontWeight:'bold'}} >{status}</div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  let win;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (!squares[i][j]) continue;
      if (j <= squares[i].length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i][j + k] !== squares[i][j + k + 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: "ToRight" };
      }
      if (i <= squares.length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j] !== squares[i + k + 1][j]) {
            win = false;
          }
        }
        if (win) return { val: squares[i][j], x: j, y: i, direction: "ToDown" };
      }
      if (
        j <= squares[i].length - nSquareToWin &&
        i <= squares.length - nSquareToWin
      ) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: "ToRightDown" };
      }
      if (i <= squares.length - nSquareToWin && j >= nSquareToWin - 1) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: "ToLeftDown" };
      }
    }
  }
  return null;
}

export default Game;
