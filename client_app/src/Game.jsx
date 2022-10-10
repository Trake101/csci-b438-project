import React from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import useGame from "./useGame";

const Game = (props) => {
    const { roomId } = useParams();
    const [cookies] = useCookies(['worduel']);
    const { guesses, sendGuess } = useGame(roomId, cookies["user-id"]);
    const [newGuess, setNewGuess] = React.useState("");
    const words = require("./words.json");

    const handleNewGuessChange = (event) => {
        setNewGuess(event.target.value);
    };

    const handleSendGuess = () => {
        if ( words.includes(newGuess) ) {
            sendGuess(newGuess);
            setNewGuess("");
        } else {
            console.log("invalid word");
        }
    };

    return (
        <div className="game-room-container">
            <h1 className="game-code">Game: {roomId}</h1>
            <div className="game-container">
                <ol className="guesses">
                    {guesses.map((guess, i) => (
                        <li key={i} className="guess">{guess.guess}</li>
                    ))}
                </ol>
            </div>
            <textarea value={newGuess} onChange={handleNewGuessChange} placeHolder="Write guess" className="guess-input" />
            <button onClick={handleSendGuess} className="send-guess">Send</button>
        </div>
    );
};

export default Game;