import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const GAME_DATA = "gameData";
const NEW_GUESS_EVENT = "newGuess";
const SOCKET_SERVER_URL = "http://localhost:4444";

const useGame = (gameId, userId) => {
  const [guesses, setGuesses] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { gameId, userId },
    });

    socketRef.current.on(GAME_DATA, (gameData) => {
      console.log(gameData);
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
      gameId,
      userId,
    });
  };

  return { guesses, sendGuess };
};

export default useGame;
