import React from "react";
import Square from "./Square";
import "./styles.css";
const nSquareToWin = 5;
function SquareRow(props) {
  let squareRow = props.row.map((square, idx) => {
    let k = "s" + idx;
    let win = false;
    let { winner, rowIdx } = props;
    if (winner) {
      if (
        winner.direction === "ToRight" &&
        idx >= winner.x &&
        idx <= winner.x + nSquareToWin - 1 &&
        rowIdx === winner.y
      ) {
        win = true;
      }
      if (
        winner.direction === "ToDown" &&
        rowIdx >= winner.y &&
        rowIdx <= winner.y + nSquareToWin - 1 &&
        idx === winner.x
      ) {
        win = true;
      }
      if (
        winner.direction === "ToRightDown" &&
        idx >= winner.x &&
        idx <= winner.x + nSquareToWin - 1 &&
        idx - winner.x === rowIdx - winner.y
      ) {
        win = true;
      }
      if (
        winner.direction === "ToLeftDown" &&
        idx <= winner.x &&
        idx >= winner.x - nSquareToWin + 1 &&
        winner.x - idx === rowIdx - winner.y
      ) {
        console.log(
          winner.x +
            " " +
            winner.y +
            " " +
            idx +
            " " +
            rowIdx +
            " " +
            nSquareToWin
        );
        win = true;
      }
    }
    return (
      <Square
        win={win}
        value={square}
        onClick={() => props.onClick(props.rowIdx, idx)}
        key={k}
      />
    );
  });
  return <div className="board-row">{squareRow}</div>;
}

SquareRow.propTypes = {};

export default SquareRow;
