import React from "react";
import Spinner from "../spinner/Spinner";

type Props = {
  onClick: () => void;
  text: string;
  loading?: boolean;
};

const Button = (props: Props) => {
  return (
    <button
      onClick={props.loading ? () => console.log("loading...") : props.onClick}
      className={`bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center p-2`}
    >
      {props.loading ? <Spinner /> : props.text}
    </button>
  );
};

export default Button;
