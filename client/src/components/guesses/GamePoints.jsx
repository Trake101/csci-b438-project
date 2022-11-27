import classnames from 'classnames';

export const GamePoints = ({
  points,
  isPlayer
}) => {
  const classes = classnames(
    'w-24 h-14 flex items-center justify-center mx-0.5 text-4xl font-bold dark:text-white border-solid border-2 rounded',
    {
      'present shadowed text-white border-green-500':
        isPlayer === true,
      'present shadowed text-white border-red-500':
        isPlayer === false,
    }
  );

  return (
    <div className={classes}>
      {points}
    </div>
  )
}