import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import useGame from "../includes/useGame";
import { Guesses } from "../components/guesses/Guesses";
import { GamePoints } from "../components/guesses/GamePoints";
import { Keyboard } from "../components/keyboard/Keyboard";
import { Rules } from '../components/rules/Rules';
import { InvalidWord } from "../components/InvalidWord";

const Game = () => {
    const { roomId } = useParams();
    const [cookies] = useCookies(['worduel']);
    const { sendGuess, gameData, getGameData } = useGame(roomId, cookies["user-id"]);
    const [newGuess, setNewGuess] = useState("");
    const [areRulesOpen, setAreRulesOpen] = useState(true)
    const [isWordInvalid, setIsWordInvalid] = useState(false)
    const words = require("../includes/words.json");

    const handleLoadGame = () => {
        getGameData();
        setAreRulesOpen(false);
    }

    const handleSendGuess = () => {
        const guess = newGuess.toLowerCase();
        if ( words.includes(guess) ) {
            sendGuess(guess);
            setNewGuess("");
        } else {
            wordIsInvalid();
        }
    };

    const wordIsInvalid = () => {
        setIsWordInvalid(true);
        setTimeout(() => {
            setIsWordInvalid(false);
        }, 2000)
    }

    return (
        <div className="game-room-container">
            <Rules
                isOpen={areRulesOpen}
                handleClose={() => handleLoadGame()}
            />
            <h1 className="fixed bottom-2 right-3">Game: {roomId}</h1>
            {gameData[`round${gameData.currentRound}`] &&
                <>
                    <div className="mb-1 flex justify-center flex items-center text-7xl font-bold dark:text-white">
                        <GamePoints points={gameData.player1Score} isPlayer={gameData.player1 === cookies["user-id"]} />
                        <span className="w-80 flex items-center justify-center">
                            Round {gameData.currentRound}
                        </span>
                        <GamePoints points={gameData.player2Score} isPlayer={gameData.player2 === cookies["user-id"]} />
                    </div>
                </>
            }
            {gameData[`round${gameData.currentRound}`] &&
                <>
                    <Guesses 
                        guesses={gameData[`round${gameData.currentRound}`].guesses} 
                        currentGuess={newGuess} 
                        currentRowClassName={''}
                    />
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
            {gameData.currentRound === 4 &&
                <>
                    {
                        ((
                            gameData.player1Score > gameData.player2Score &&
                            gameData.player1 === cookies["user-id"]
                        ) || (
                            gameData.player2Score > gameData.player1Score &&
                            gameData.player2 === cookies["user-id"]
                        )) &&
                        <>
                            <div className="mb-1 flex justify-center flex items-center text-5xl font-bold text-green-500">
                                Game over, you won!
                            </div>
                        </>
                    }
                    {
                        ((
                            gameData.player1Score < gameData.player2Score &&
                            gameData.player1 === cookies["user-id"]
                        ) || (
                            gameData.player2Score < gameData.player1Score &&
                            gameData.player2 === cookies["user-id"]
                        )) &&
                        <>
                            <div className="mb-1 flex justify-center flex items-center text-5xl font-bold text-red-500">
                                Game over, you lost!
                            </div>
                        </>
                    }
                    <div className="mb-1 flex justify-center flex items-center text-3xl font-bold text-green-500">
                        Your Score: &nbsp;
                        {
                            gameData.player1 === cookies["user-id"] && gameData.player1Score
                        }
                        {
                            gameData.player2 === cookies["user-id"] && gameData.player2Score
                        }
                    </div>
                    <div className="mb-1 flex justify-center flex items-center text-3xl font-bold text-red-500">
                        Their Score: &nbsp;
                        {
                            gameData.player1 !== cookies["user-id"] && gameData.player1Score
                        }
                        {
                            gameData.player2 !== cookies["user-id"] && gameData.player2Score
                        }
                    </div>
                </>
            }
            <InvalidWord isOpen={isWordInvalid} />
        </div>
    );
};

export default Game;