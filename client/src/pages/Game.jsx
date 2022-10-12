import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import useGame from "../includes/useGame";
import { Guesses } from "../components/guesses/Guesses";
import { Keyboard } from "../components/keyboard/Keyboard";

const Game = () => {
    const { roomId } = useParams();
    const [cookies] = useCookies(['worduel']);
    const { sendGuess, gameData, getGameData } = useGame(roomId, cookies["user-id"]);
    const [newGuess, setNewGuess] = useState("");
    const words = require("../includes/words.json");

    const handleLoadGame = () => {
        getGameData();
    }

    const handleSendGuess = () => {
        const guess = newGuess.toLowerCase();
        if ( words.includes(guess) ) {
            sendGuess(guess);
            setNewGuess("");
        } else {
            console.log("invalid word");
        }
    };

    return (
        <div className="game-room-container">
            <h1 className="game-code">Game: {roomId}</h1>
            <h3>Round: {gameData.currentRound}</h3>
            <button onClick={handleLoadGame} className="send-guess">Connect</button>
            {gameData[`round${gameData.currentRound}`] &&
                <>
                <Guesses guesses={gameData[`round${gameData.currentRound}`].guesses} currentGuess={newGuess} currentRowClassName={''} />
                </>
            }
            {gameData.currentPlayer === cookies["user-id"] &&
                <>
                    <Keyboard 
                        guessedLetters={gameData[`round${gameData.currentRound}`].guessedLetters} 
                        matchedLetters={gameData[`round${gameData.currentRound}`].matchedLetters} 
                        incorrectLetters={gameData[`round${gameData.currentRound}`].incorrectLetters} 
                        newGuess={newGuess}
                        setNewGuess={setNewGuess}
                        sendGuess={handleSendGuess}
                    />
                </>
            }
        </div>
    );
};

export default Game;