import * as React from "react";
const SvgMath = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M40 184h64M72 152v64M104 72H40M216 168.1h-64M216 199.9h-64M208 48l-48 48M208 96l-48-48"
    />
  </svg>
);
export default SvgMath;
