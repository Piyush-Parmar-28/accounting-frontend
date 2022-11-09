export const validName = new RegExp("^[a-zA-Z\\s]{5,20}$");

export const validEmail = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);

// r'^
//   (?=.*[A-Z])       // should contain at least one upper case
//   (?=.*[a-z])       // should contain at least one lower case
//   (?=.*?[0-9])      // should contain at least one digit
//   (?=.*?[!@#\$&*~]) // should contain at least one Special character
//   .{8,}             // Must be at least 8 characters in length
// $
export const validPassword = new RegExp(
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~.-]).{8,}$"
);

export const validSymbols = new RegExp("^(?=.*?[!@#$&*~.-])");

export const validNumbers = new RegExp("^(?=.*?[0-9])");

export const validPAN = new RegExp(
  "^[A-Z]{4}[P,C,H,A,B,G,J,L,F,T][0-9]{4}[A-Z]{1}"
);
