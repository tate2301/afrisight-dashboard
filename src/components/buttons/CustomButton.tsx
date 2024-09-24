import React from "react";

type Props = {
  onClick: () => void;
  text: string;
  loading?: boolean;
};

const Button = (props: Props) => {
  return (
    <button
      onClick={props.loading ? () => console.log("loadiing...") : props.onClick}
      className={`bg-indigo-600 text-white font-semibold rounded-xl p-2`}
    >
      {props.loading ? "Loading..." : props.text}
    </button>
  );
};

export default Button;
