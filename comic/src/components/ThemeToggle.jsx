import { useImperativeHandle, useId, forwardRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = forwardRef((_, ref) => {
  const { toggleTheme } = useContext(ThemeContext);
  const id = useId();

  useImperativeHandle(ref, () => ({
    triggerToggle: ()=> toggleTheme(),
  }));

  return (
    <button
      id={id}
      onClick={toggleTheme}
      className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
    >
    
    </button>
  );
});

export default ThemeToggle;
