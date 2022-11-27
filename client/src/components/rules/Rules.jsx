import { Cell } from '../guesses/Cell'
import { BaseModal } from './BaseModal'

export const Rules = ({ isOpen, handleClose }) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        You and your opponent take turns trying to guess the word, up to 6 turns for 3 rounds. 
        After each guess, the color of the tiles will change to show how close your guess was to the word.
        Correctly guessing the word starts the next round and the player that correctly guessed the word goes first.
        The player with the most points after 3 rounds wins the game.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="A" status="matched" />
        <Cell value="F" />
        <Cell value="T" />
        <Cell value="E" />
        <Cell value="R" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter A is in the word in the correct spot and worth 20 points.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="A" status="matched" />
        <Cell value="N" />
        <Cell value="G" />
        <Cell value="L" status="guessed" />
        <Cell value="E" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter L is in the word in the wrong spot and worth 10 points.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="A" status="matched" />
        <Cell value="L" status="matched" />
        <Cell value="O" status="matched" />
        <Cell value="H" status="matched" />
        <Cell value="A" status="matched" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Correctly guessing the word is worth 100 points.
      </p>
    </BaseModal>
  )
}