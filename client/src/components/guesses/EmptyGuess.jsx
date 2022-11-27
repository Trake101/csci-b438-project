import { Cell } from './Cell';
import { Points } from './Points';

export const EmptyGuess = () => {
  const emptyCells = Array.from(Array(5));

  return (
    <div className="mb-1 flex justify-center">
      <Points points={' '} />
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
      <Points points={' '} />
    </div>
  );
}