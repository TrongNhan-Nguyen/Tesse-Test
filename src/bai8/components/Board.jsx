import React from "react";
import SquareRow from "./SquareRow";

function Board(props) {
  let board;
  board = props.squares.map((row, idx) => {
    let k = "r" + idx;
    return (
      <SquareRow
        winner={props.winner}
        rowIdx={idx}
        row={row}
        onClick={props.onClick}
        key={k}
      />
    );
  });
  return <div>{board}</div>;
}

export default Board;
