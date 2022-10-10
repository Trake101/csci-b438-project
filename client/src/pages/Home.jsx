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
        <div class="grid h-screen place-items-center">
            <form class="px-8 pt-6 pb-8 mb-4">
                <h1 className="text-7xl font-sans font-bold leading-normal mt-0 mb-2 text-gray-400">
                    Worduel
                </h1>
                <div class="mb-4">
                    <input type="text" placeholder="Game Code" value={roomId} onChange={handleRoomNameChange} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div class="flex items-center justify-between">
                    <button onClick={handleJoinGame} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Game</button>
                    <button onClick={handleNewGame} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2 rounded">New Game</button>
                </div>
            </form>
        </div>
    );
};

export default Home;