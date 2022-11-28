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
  player1Score integer,
  player2 text,
  player2Score integer,
  round1 text,
  round2 text,
  round3 text,
  currentRound integer,
  currentPlayer text
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
        0,
        '',
        0,
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

function updateRoundDataPromise(gameData, guess) {
  return new Promise((resolve) => {
    const word = JSON.parse(gameData.words)[gameData.currentRound - 1];
    let roundData = JSON.parse(gameData[`round${gameData.currentRound}`]);

    let points = 0;
    let matchedLetters = roundData.matchedLetters
      ? roundData.matchedLetters
      : [];
    let guessedLetters = roundData.guessedLetters
      ? roundData.guessedLetters
      : [];
    let incorrectLetters = roundData.incorrectLetters
      ? roundData.incorrectLetters
      : [];
    let indicators = [];
    let nextRound = gameData.currentRound;
    let nextPlayer =
      gameData.currentPlayer === "player1" ? "player2" : "player1";

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
      player: gameData.currentPlayer,
      points: points,
      indicators: indicators,
    };

    if (word === guess) {
      points += 100;
      if (nextRound < 4) {
        nextRound += 1;
      }
      if (nextRound === 4) {
        nextPlayer = "game over";
      } else {
        nextPlayer = gameData.currentPlayer;
      }
    } else if (roundData.guesses.length === 6) {
      if (nextRound < 4) {
        nextRound += 1;
      }
      if (nextRound === 4) {
        nextPlayer = "game over";
      }
    }

    roundData[`${gameData.currentPlayer}_points`] += points;
    roundData.matchedLetters = matchedLetters;
    roundData.guessedLetters = guessedLetters;
    roundData.incorrectLetters = incorrectLetters;
    const gamePoints = gameData[`${gameData.currentPlayer}Score`] + points;

    db.run(
      `UPDATE games
      SET round${gameData.currentRound} = '${JSON.stringify(roundData)}',
      currentRound = ${nextRound},
      currentPlayer = '${nextPlayer}',
      ${gameData.currentPlayer}Score = ${gamePoints}
      WHERE gameId = '${gameData.gameId}'`,
      () => {
        resolve();
      }
    );
  });
}

function returnDataPromise(gameData) {
  return new Promise((resolve) => {
    const round1 = JSON.parse(gameData.round1);
    const round2 = JSON.parse(gameData.round2);
    const round3 = JSON.parse(gameData.round3);

    const returnData = {
      player1: gameData.player1,
      player2: gameData.player2,
      currentRound: gameData.currentRound,
      currentPlayer: gameData[gameData.currentPlayer],
      player1Score: gameData.player1Score,
      player2Score: gameData.player2Score,
      round1: {
        guesses: round1.guesses,
        matchedLetters: round1.matchedLetters ? round1.matchedLetters : [],
        guessedLetters: round1.guessedLetters ? round1.guessedLetters : [],
        incorrectLetters: round1.incorrectLetters
          ? round1.incorrectLetters
          : [],
        player1_points: round1.player1_points,
        player2_points: round1.player2_points,
      },
      round2: {
        guesses: round2.guesses,
        matchedLetters: round2.matchedLetters ? round2.matchedLetters : [],
        guessedLetters: round2.guessedLetters ? round2.guessedLetters : [],
        incorrectLetters: round2.incorrectLetters
          ? round2.incorrectLetters
          : [],
        player1_points: round2.player1_points,
        player2_points: round2.player2_points,
      },
      round3: {
        guesses: round3.guesses,
        matchedLetters: round3.matchedLetters ? round3.matchedLetters : [],
        guessedLetters: round3.guessedLetters ? round3.guessedLetters : [],
        incorrectLetters: round3.incorrectLetters
          ? round3.incorrectLetters
          : [],
        player1_points: round3.player1_points,
        player2_points: round3.player2_points,
      },
    };

    resolve(returnData);
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
    let returnData = await returnDataPromise(gameData);

    socket.on(GAME_DATA, async () => {
      console.log(returnData);
      io.in(gameId).emit(GAME_DATA, returnData);
    });

    socket.on(NEW_GUESS_EVENT, async (data) => {
      const { guess, userId, gameId } = data;
      gameData = await gameDataPromise(gameId);

      await updateRoundDataPromise(gameData, guess);

      gameData = await gameDataPromise(gameId);
      returnData = await returnDataPromise(gameData);

      console.info(
        `User Guessed: { gameId: '${gameId}', userId: '${userId}', guess: '${guess}' }`
      );

      io.in(gameId).emit(NEW_GUESS_EVENT, returnData);
    });

    socket.on("disconnect", () => {
      socket.leave(gameId);
    });
  }
});

server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
