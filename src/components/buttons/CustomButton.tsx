import React from 'react';

type Props = {
  onClick: () => void;
  text: string;
  loading?: boolean;
};

const CustomButton = (props: Props) => {
  return (
    <button
      onClick={props.loading ? () => console.log('loadiing...') : props.onClick}
      className={`bg-zinc-950 text-white font-semibold rounded-full p-2`}
    >
      {props.loading ? 'Loading...' : props.text}
    </button>
  );
};

export default CustomButton;
