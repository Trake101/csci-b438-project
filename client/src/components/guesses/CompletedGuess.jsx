import { Cell } from './Cell';

export const CompletedGuess = ({ guess }) => {
  const letters = guess.guess.split('');

  return (
    <div className="mb-1 flex justify-center">
      {letters.map((letter, i) => (
        <Cell
          key={i}
          value={letter.toUpperCase()}
          status={guess.indicators[i]}
          position={i}
          isCompleted
        />
      ))}
    </div>
  );
}