### Server

- [x] Set up web sockets
  - [x] Create rooms per game
  - [x] Connect users to correct room
  - [x] Select words for new game
- [x] Add word list
- [x] Check guesses against current word
- [x] Calculate scores per guess
- [x] Connect to SQLite
  - [x] Track current round
  - [x] Track current player's turn
  - [x] Track games in SQLite
  - [x] Track score per guess
  - [x] Track score per round
  - [x] Track score per game
  - [x] Track guessed letters
- [x] Clean up return data

### Client

- [x] Interface for game creation or joining
  - [x] Generate UUID per user and store as cookie
  - [x] Generate 4-character gameId
- [ ] Interface for game room
  - [x] Connect to server
  - [x] Add word list
  - [ ] Guesses component
  - [ ] Keyboard component
  - [ ] Scoreboard component
  - [x] Limit guessing to current player
  - [x] Validate guesses against word list
