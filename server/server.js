const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4444;
const NEW_GUESS_EVENT = "newGuess";

io.on("connection", (socket) => {
  const { gameId, userId } = socket.handshake.query;
  socket.join(gameId);
  console.info(`User Joined: { gameId: '${gameId}', userId: '${userId}' }`);

  socket.on(NEW_GUESS_EVENT, (data) => {
    const { guess } = data;
    console.info(
      `User Guessed: { gameId: '${gameId}', userId: '${userId}', guess: '${guess}' }`
    );
    io.in(gameId).emit(NEW_GUESS_EVENT, data);
  });

  socket.on("disconnect", () => {
    socket.leave(gameId);
  });
});

server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
