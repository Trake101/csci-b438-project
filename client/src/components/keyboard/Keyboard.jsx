import { Key } from './Key'

export const Keyboard = ({guessedLetters, matchedLetters, incorrectLetters, newGuess, setNewGuess, sendGuess}) => {
  const checkStatus = (key) => {
    if (matchedLetters.includes(key.toString().toLowerCase())) {
      return 'matched';
    }

    if (guessedLetters.includes(key.toString().toLowerCase())) {
      return 'guessed';
    }

    if (incorrectLetters.includes(key.toString().toLowerCase())) {
      return 'incorrect';
    }

    return false;
  };

  const handleNewGuessChange = (letter) => {
    if (newGuess.length < 5) {
      const guess = newGuess + letter;
      setNewGuess(guess);
    }
  };

  const handleDelete = () => {
    if (newGuess.length > 0) {
      const guess = newGuess.slice(0, -1);
      setNewGuess(guess);
    }
  }

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={(key) => {handleNewGuessChange(key)}}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={(key) => {handleNewGuessChange(key)}}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="DELETE" onClick={(key) => {handleDelete()}}>
          DELETE
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={(key) => {handleNewGuessChange(key)}}
          />
        ))}
        <Key width={65.4} value="ENTER" onClick={(key) => {sendGuess()}}>
          ENTER
        </Key>
      </div>
    </div>
  )
}