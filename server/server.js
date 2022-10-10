const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db/games.db");
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4444;
const NEW_GUESS_EVENT = "newGuess";
const GAME_DATA = "gameData";
const words = require("./words.json");

db.run(`CREATE TABLE IF NOT EXISTS games(
  gameId text,
  words text,
  player1 text,
  player2 text,
  round1 text,
  round2 text,
  round3 text,
  currentRound integer,
  currentTurn text
)`);

function gameDataPromise(gameId) {
  return new Promise((resolve) => {
    db.get("SELECT * FROM games WHERE gameId=?", [gameId], (err, row) => {
      resolve(row);
    });
  });
}

function newGamePromise(gameId, userId) {
  return new Promise((resolve) => {
    const max = words.length + 1;
    const word1 = words[Math.floor(Math.random() * max)];
    const word2 = words[Math.floor(Math.random() * max)];
    const word3 = words[Math.floor(Math.random() * max)];
    const gameWords = `["${word1}", "${word2}", "${word3}"]`;

    const findUnique = (word) => {
      let uniq = "";
      let res = [];

      for (let i = 0; i < word.length; i++) {
        if (uniq.includes(word[i]) === false) {
          uniq += word[i];
          res.push({ letter: word[i], points: 10 });
        }
      }

      return res;
    };

    const round1Data = {
      guesses: [],
      guessPoints: findUnique(word1),
      matchPoints: [20, 20, 20, 20, 20],
      player1_points: 0,
      player2_points: 0,
    };
    const round2Data = {
      guesses: [],
      guessPoints: findUnique(word2),
      matchPoints: [20, 20, 20, 20, 20],
      player1_points: 0,
      player2_points: 0,
    };
    const round3Data = {
      guesses: [],
      guessPoints: findUnique(word3),
      matchPoints: [20, 20, 20, 20, 20],
      player1_points: 0,
      player2_points: 0,
    };

    db.run(
      `INSERT INTO games VALUES (
        '${gameId}',
        '${gameWords}',
        '${userId}',
        '',
        '${JSON.stringify(round1Data)}',
        '${JSON.stringify(round2Data)}',
        '${JSON.stringify(round3Data)}',
        1,
        'player1'
      )`,
      (err) => {
        if (err) {
          console.log(err);
        }
        resolve();
      }
    );
  });
}

function joinGamePromise(gameId, userId) {
  return new Promise((resolve) => {
    db.run(
      `UPDATE games
      SET player2 = '${userId}'
      WHERE gameId = '${gameId}'`,
      () => {
        resolve();
      }
    );
  });
}

function updateRoundDataPromise(gameId, round, player, word, guess, roundData) {
  return new Promise((resolve) => {
    let points = 0;
    let matchedLetters = [];
    let guessedLetters = [];
    let incorrectLetters = [];
    let indicators = [];
    let nextRound = round;
    let nextPlayer = player === "player1" ? "player2" : "player1";
    if (word === guess) {
      points += 100;
      if (nextRound < 3) {
        nextRound += 1;
      }
      nextPlayer = player;
    }

    const wordChars = word.split("");
    const guessChars = guess.split("");

    for (i = 0; i < guessChars.length; i++) {
      let found = false;
      if (guessChars[i] === wordChars[i]) {
        points += roundData.matchPoints[i];
        roundData.matchPoints[i] = 0;

        if (!matchedLetters.includes(guessChars[i])) {
          matchedLetters.push(guessChars[i]);
        }

        indicators.push("matched");
        found = true;
      }

      for (j = 0; j < roundData.guessPoints.length; j++) {
        if (roundData.guessPoints[j].letter === guessChars[i]) {
          points += roundData.guessPoints[j].points;
          roundData.guessPoints[j].points = 0;

          if (
            !matchedLetters.includes(guessChars[i]) &&
            !guessedLetters.includes(guessChars[i])
          ) {
            guessedLetters.push(guessChars[i]);
          }

          if (!found) {
            indicators.push("guessed");
            found = true;
          }
        }
      }

      if (
        !matchedLetters.includes(guessChars[i]) &&
        !guessedLetters.includes(guessChars[i]) &&
        !incorrectLetters.includes(guessChars[i])
      ) {
        incorrectLetters.push(guessChars[i]);
      }

      if (!found) {
        indicators.push("incorrect");
      }
    }

    roundData.guesses[roundData.guesses.length] = {
      guess: guess,
      player: player,
      points: points,
      indicators: indicators,
    };
    roundData[`${player}_points`] += points;

    db.run(
      `UPDATE games
      SET round${round} = '${JSON.stringify(roundData)}',
      currentRound = ${nextRound},
      currentTurn = '${nextPlayer}'
      WHERE gameId = '${gameId}'`,
      () => {
        resolve();
      }
    );
  });
}

io.on("connection", async (socket) => {
  const { gameId, userId } = socket.handshake.query;

  let gameData = await gameDataPromise(gameId);

  if (gameData === undefined) {
    await newGamePromise(gameId, userId);
    gameData = await gameDataPromise(gameId);
  }

  if (userId !== gameData.player1 && gameData.player2 === "") {
    await joinGamePromise(gameId, userId);
    gameData = await gameDataPromise(gameId);
  }

  if (userId === gameData.player1 || userId === gameData.player2) {
    socket.join(gameId);
    io.in(gameId).emit(GAME_DATA, gameData);

    socket.on(NEW_GUESS_EVENT, async (data) => {
      const { guess, userId, gameId } = data;
      gameData = await gameDataPromise(gameId);
      gameWords = JSON.parse(gameData.words);
      roundData = JSON.parse(gameData[`round${gameData.currentRound}`]);

      await updateRoundDataPromise(
        gameId,
        gameData.currentRound,
        gameData.currentTurn,
        gameWords[gameData.currentRound - 1],
        guess,
        roundData
      );

      gameData = await gameDataPromise(gameId);

      console.info(
        `User Guessed: { gameId: '${gameId}', userId: '${userId}', guess: '${guess}' }`
      );

      io.in(gameId).emit(NEW_GUESS_EVENT, data);
    });

    socket.on("disconnect", () => {
      socket.leave(gameId);
    });
  }
});

server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
