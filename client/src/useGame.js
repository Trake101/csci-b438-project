import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_GUESS_EVENT = "newGuess";
const SOCKET_SERVER_URL = "http://localhost:4444";

const useGame = (gameId, userId) => {
  const [guesses, setGuesses] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { gameId, userId },
    });

    socketRef.current.on(NEW_GUESS_EVENT, (guess) => {
      const incomingGuess = {
        ...guess,
      };
      setGuesses((guesses) => [...guesses, incomingGuess]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [gameId, userId]);

  const sendGuess = (guess) => {
    socketRef.current.emit(NEW_GUESS_EVENT, {
      guess,
    });
  };

  return { guesses, sendGuess };
};

export default useGame;
