import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useCookies } from "react-cookie";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = React.useState("");
    const [cookies, setCookie] = useCookies(['worduel']);
    let userId = uuid();

    const handleRoomNameChange = (event) => {
        if ( cookies["user-id"] === 'undefined' || cookies["user-id"] === undefined ) {
            setCookie("user-id", userId, {
                path: "/"
            });
        } else {
            userId = cookies["user-id"];
        }

        setRoomId(event.target.value);
    }

    const handleJoinGame = () => {
        return navigate(`/${roomId}`);
    }

    const handleNewGame = () => {
        let gameId = '';
        const chars = 'BCDFGHJKLMNPQRSTVWXYZ';
        
        for ( var i = 0; i < 4; i++ ) {
            gameId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return navigate(`/${gameId}`);
    }

    return (
        <div className="home-container">
            <input type="text" placeholder="Game Code" value={roomId} onChange={handleRoomNameChange} className="text-input-field" />
            <button onClick={handleJoinGame} className="join-game">Join Game</button>
            <button onClick={handleNewGame} className="new-game">New Game</button>
        </div>
    );
};

export default Home;