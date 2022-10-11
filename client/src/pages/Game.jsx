import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import useGame from "../includes/useGame";
import { Keyboard } from "../components/keyboard/Keyboard";

const Game = (props) => {
    const { roomId } = useParams();
    const [cookies] = useCookies(['worduel']);
    const { sendGuess, gameData, getGameData } = useGame(roomId, cookies["user-id"]);
    const [newGuess, setNewGuess] = useState("");
    const words = require("../includes/words.json");

    const handleLoadGame = () => {
        getGameData();
    }

    const handleNewGuessChange = (event) => {
        setNewGuess(event.target.value);
    };

    const handleSendGuess = () => {
        if ( words.includes(newGuess) ) {
            sendGuess(newGuess);
            console.log(gameData);
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
            <div className="game-container">
                <ol className="guesses">
                    {gameData[`round${gameData.currentRound}`] && gameData[`round${gameData.currentRound}`].guesses?.map((guess, i) => (
                        <li key={i} className="guess">{guess.guess}</li>
                    ))}
                </ol>
            </div>
            {gameData.currentPlayer === cookies["user-id"] &&
                <>
                <textarea value={newGuess} onChange={handleNewGuessChange} placeHolder="Write guess" className="guess-input" />
                <button onClick={handleSendGuess} className="send-guess">Send</button>
                <Keyboard 
                    guessedLetters={gameData[`round${gameData.currentRound}`].guessedLetters} 
                    matchedLetters={gameData[`round${gameData.currentRound}`].matchedLetters} 
                    incorrectLetters={gameData[`round${gameData.currentRound}`].incorrectLetters} 
                />
                </>
            }
        </div>
    );
};

export default Game;