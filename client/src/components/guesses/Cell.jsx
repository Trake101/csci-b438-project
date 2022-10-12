import classnames from 'classnames';

export const Cell = ({
  value,
  status,
}) => {
  const classes = classnames(
    'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        !status,
      'border-black dark:border-slate-100': value && !status,
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'incorrect',
      'correct shadowed bg-green-500 text-white border-green-500':
        status === 'matched',
      'present shadowed bg-yellow-500 text-white border-yellow-500':
        status === 'guessed',
    }
  );

  return (
    <div className={classes}>
      <div className="letter-container">
        {value}
      </div>
    </div>
  );
}