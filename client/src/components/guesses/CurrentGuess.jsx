import { Cell } from './Cell';

export const CurrentGuess = ({ guess, className }) => {
  guess = guess.split('');
  const emptyCells = Array.from(Array(5 - guess.length));
  const classes = `flex justify-center mb-1 ${className}`;

  return (
    <div className={classes}>
      {guess.map((letter, i) => (
        <Cell key={i} value={letter.toUpperCase()} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
}
