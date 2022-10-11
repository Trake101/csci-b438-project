import { useEffect } from 'react'
import { Key } from './Key'

export const Keyboard = ({guessedLetters, matchedLetters, incorrectLetters}) => {
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

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={() => {console.log();}}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={() => {console.log();}}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="ENTER" onClick={() => {console.log();}}>
          ENTER
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            status={checkStatus(key)}
            onClick={() => {console.log();}}
          />
        ))}
        <Key width={65.4} value="DELETE" onClick={() => {console.log();}}>
          DELETE
        </Key>
      </div>
    </div>
  )
}