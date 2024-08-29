// Clock.js
import { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time once the component mounts
    setCurrentTime(new Date());

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="text-4xl font-bold bg-zinc-900 text-white w-full h-full text-center p-4 grid items-center content-center rounded-xl">
      {currentTime ? formatTime(currentTime) : 'Loading...'}
    </div>
  );
};

export default Clock;
