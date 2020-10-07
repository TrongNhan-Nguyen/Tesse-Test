import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Game from "./components/Game";
import useClock from "./components/useClock";

function Bai8(props) {
  const user = useSelector((state) => state.user.user);
  const opponent = useSelector((state) => state.user.opponent);
  const [player1, setPlayer1] = useState(() => (user ? user.fullName : ""));
  const [player2, setPlayer2] = useState(() =>
    opponent ? opponent.fullName : ""
  );
  const [error, setError] = useState("");
  const [showClock, setShowClock] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [disable, setDisable] = useState(false);
  const [timeString, minutes] = useClock();
  const isEnd = useRef(false);
  const winner = useRef("");
  const history = useHistory();

  const startGame = () => {
    if (!player1 || !player2) {
      setError("This game require 2 player");
      return;
    }
    setError("");
    setShowClock(true);
    setDisable(true);
    setShowBoard(true);
  };
  const restartGame = () => {
    if (user && opponent) {
      return history.push("user");
    }
    window.location.reload(false);
  };
  useEffect(() => {
    if (minutes === 20) {
      setShowClock(false);
      setError(timeString);
    }
  }, [minutes]);
  const handleWin = (endGame, nameWinner) => {
    if (endGame) {
      isEnd.current = true;
      winner.current = nameWinner;
    }
  };
  const saveHistory = async (duration) => {
    try {
      if (user && opponent) {
        let winnerParams;
        if (winner.current === player1) {
          winnerParams = user._id;
        } else {
          winnerParams = opponent._id;
        }
        const response = await fetch(
          `http://localhost:5000/result-match/${user._id}/${opponent._id}/${winnerParams}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ duration }),
          }
        );
        const status = await response.status;
        if (status === 200) {
          console.log("Save successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isEnd.current) {
      setShowClock(false);
      setError(`Winner: ${winner.current} \nDuration: ${timeString}`);
      saveHistory(timeString);
    }
  }, [isEnd.current]);
  return (
    <div>
      <h1>Caro game</h1>
      <input
        style={{ marginRight: 5 }}
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        name="firstPLay"
        placeholder="First player name"
        disabled={disable}
      />
      <input
        style={{ marginRight: 5 }}
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
        name="secondPlayer"
        placeholder="Second player name"
        disabled={disable}
      />
      <button disabled={disable} onClick={startGame}>
        Start
      </button>
      <button onClick={restartGame}>Restart</button>
      {error && (
        <h2 style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</h2>
      )}
      {showClock && (
        <div>
          <h2 style={{ color: "red" }}>{timeString}</h2>
        </div>
      )}
      {showBoard && (
        <Game
          handleWin={handleWin}
          firstPlayer={player1}
          secondPlayer={player2}
        />
      )}
    </div>
  );
}

export default Bai8;
