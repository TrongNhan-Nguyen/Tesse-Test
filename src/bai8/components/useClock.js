import { useEffect, useRef, useState } from "react";
function useClock() {
  const [timeString, setTimeString] = useState("");
  const minutes = useRef(0);

  useEffect(() => {
    let second = 0;
    let milliSeconds = 0;
    const interval = setInterval(() => {
      milliSeconds += 1;
      if (milliSeconds === 10) {
        milliSeconds = 0;
        second += 1;
      }
      if (second === 60) {
        second = 0;
        minutes.current += 1;
      }
      let minuteString = `0${minutes.current}`.slice(-2);
      let secondString = `0${second}`.slice(-2);
      setTimeString(`${minuteString}:${secondString}.${milliSeconds}`);
    }, 100);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  return [timeString, minutes.current];
}

export default useClock;
