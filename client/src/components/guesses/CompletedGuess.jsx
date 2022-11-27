import { Cell } from './Cell';
import { Points } from './Points';

export const CompletedGuess = ({ guess }) => {
  const letters = guess.guess.split('');

  return (
    <div className="mb-1 flex justify-center">
      {guess.player === 'player1' ?
        <>
          <Points points={guess.points} />
        </>
      : <><Points points={' '} /></>}
      {letters.map((letter, i) => (
        <Cell
          key={i}
          value={letter.toUpperCase()}
          status={guess.indicators[i]}
          position={i}
          isCompleted
        />
      ))}
      {guess.player === 'player2' ?
        <>
          <Points points={guess.points} />
        </>
      : <><Points points={' '} /></>}
    </div>
  );
}