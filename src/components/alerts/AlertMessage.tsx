import React from 'react';

type Props = {
  type: 'error' | 'success' | 'message';
  text: string;
};

function AlertMessage({ type, text }: Props) {
  return (
    <div
      className={`${
        type === 'error'
          ? 'bg-red-200 '
          : type === 'success'
          ? 'bg-green-200'
          : 'bg-blue-200'
      } text-xs p-2 rounded-lg`}
    >
      <p
        className={`${
          type === 'error'
            ? 'text-red-500 '
            : type === 'success'
            ? 'text-green-500'
            : 'text-blue-500'
        } text-center`}
      >
        {text}
      </p>
    </div>
  );
}

export default AlertMessage;
