import { CompletedGuess } from './CompletedGuess'
import { CurrentGuess } from './CurrentGuess'
import { EmptyGuess } from './EmptyGuess'

export const Guesses = ({
  guesses,
  currentGuess,
  currentRowClassName,
}) => {
  const MAX_CHALLENGES = 6;
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  return (
    <>
      {guesses.map((guess, i) => (
        <CompletedGuess
          key={i}
          guess={guess}
        />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentGuess guess={currentGuess} className={currentRowClassName} />
      )}
      {empties.map((_, i) => (
        <EmptyGuess key={i} />
      ))}
    </>
  )
}