import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const GAME_DATA = "gameData";
const NEW_GUESS_EVENT = "newGuess";
const SOCKET_SERVER_URL = "http://localhost:4444";

const useGame = (gameId, userId) => {
  const [gameData, setGameData] = useState({});
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { gameId, userId },
    });

    socketRef.current.on(GAME_DATA, (data) => {
      setGameData(data);
    });

    socketRef.current.on(NEW_GUESS_EVENT, (data) => {
      setGameData(data);
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

  const getGameData = () => {
    socketRef.current.emit(GAME_DATA, {});
  };

  return { sendGuess, gameData, getGameData };
};

export default useGame;
