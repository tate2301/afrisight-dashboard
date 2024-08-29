import { format } from 'date-fns';
import { useState } from 'react';

const Calendar = () => {
  const [today, setToday] = useState(new Date());

  const getMonthCalendar = (date: Date) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    const daysInMonth = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Setting day to 0 gets the last day of the previous month

    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
      daysInMonth.push(new Date(day));
    }

    return daysInMonth;
  };

  const getDayClass = (day: any) => {
    if (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth()
    ) {
      return `bg-zinc-100 font-bold`;
    } else {
      return '';
    }
  };

  const renderDay = (day: any) => {
    return (
      <div
        key={day.getTime()}
        className={`${getDayClass(day)} p-1 text-xs rounded-full`}
      >
        <p>{day.getDate()}</p>
      </div>
    );
  };

  return (
    <div
      className={`w-full bg-zinc-900 main-border rounded-xl primary-border p-4`}
    >
      <div className={`flex items-center mb-4 space-x-4`}>
        {/* <h1>Calendar</h1> */}
        <span className="text-xl font-bold text-white flex-1">
          {format(today, ' yyyy')}
        </span>
        {/* <div className="flex flex-row items-center space-x-4">
          <span className="bg-slate-900 dark:bg-white cursor-pointer text-white dark:text-zinc-900 rounded-full p-[2px]">
            <ChevronLeftIcon height={12} width={12} />
          </span>
          <span className="bg-slate-900 dark:bg-white cursor-pointer text-white dark:text-zinc-900 rounded-full p-[2px]">
            <ChevronRightIcon height={12} width={12} />
          </span>
        </div> */}
      </div>
      <div className={`flex justify-between mb-2 text-xs text-white font-bold`}>
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>
      <div className={`grid grid-cols-7 gap-4 text-zinc-400`}>
        {getMonthCalendar(today).map((item, index) => (
          <div key={index} className="flex">
            {renderDay(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
