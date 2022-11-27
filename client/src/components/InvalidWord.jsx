import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'

export const InvalidWord = ({
  isOpen,
  variant = 'error',
}) => {
  const classes = classNames(
    'fixed z-20 bottom-5 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
    {
      'bg-rose-500 text-white': variant === 'error',
    }
  )

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300 transition"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={classes}>
        <div className="p-2">
          <p className="text-center text-sm font-medium">Word not in dictionary.</p>
        </div>
      </div>
    </Transition>
  )
}