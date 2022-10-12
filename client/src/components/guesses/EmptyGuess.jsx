import { Cell } from './Cell';

export const EmptyGuess = () => {
  const emptyCells = Array.from(Array(5));

  return (
    <div className="mb-1 flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
}