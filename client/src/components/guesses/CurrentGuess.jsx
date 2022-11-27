import { Cell } from './Cell';
import { Points } from './Points';

export const CurrentGuess = ({ guess, className }) => {
  guess = guess.split('');
  const emptyCells = Array.from(Array(5 - guess.length));
  const classes = `flex justify-center mb-1 ${className}`;

  return (
    <div className={classes}>
      <Points points={' '} />
      {guess.map((letter, i) => (
        <Cell key={i} value={letter.toUpperCase()} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
      <Points points={' '} />
    </div>
  );
}
