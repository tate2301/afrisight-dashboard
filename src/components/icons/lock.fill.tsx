import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const LockFill = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.19922 17.7969C5.6263 17.7969 5.1888 17.6406 4.88672 17.3281C4.58984 17.0156 4.44141 16.5521 4.44141 15.9375V10.5547C4.44141 9.9401 4.58984 9.47917 4.88672 9.17188C5.1888 8.85938 5.6263 8.70312 6.19922 8.70312H13.3477C13.9206 8.70312 14.3555 8.85938 14.6523 9.17188C14.9544 9.47917 15.1055 9.9401 15.1055 10.5547V15.9375C15.1055 16.5521 14.9544 17.0156 14.6523 17.3281C14.3555 17.6406 13.9206 17.7969 13.3477 17.7969H6.19922ZM5.80859 9.30469V6.83594C5.80859 5.85677 5.99609 5.04427 6.37109 4.39844C6.7513 3.7526 7.24349 3.27083 7.84766 2.95312C8.45182 2.63021 9.09245 2.46875 9.76953 2.46875C10.4518 2.46875 11.0951 2.63021 11.6992 2.95312C12.3034 3.27083 12.793 3.7526 13.168 4.39844C13.5482 5.04427 13.7383 5.85677 13.7383 6.83594V9.30469H12.5039V6.66406C12.5039 6.00781 12.3763 5.45573 12.1211 5.00781C11.8711 4.5599 11.5378 4.22135 11.1211 3.99219C10.7096 3.76302 10.2591 3.64844 9.76953 3.64844C9.28516 3.64844 8.83464 3.76302 8.41797 3.99219C8.00651 4.22135 7.67578 4.5599 7.42578 5.00781C7.17578 5.45573 7.05078 6.00781 7.05078 6.66406V9.30469H5.80859Z"
      fill="currentColor"
    />
  </svg>
);

export { LockFill };