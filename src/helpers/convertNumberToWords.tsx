var ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
var tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
var teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

function convert_crores(num: number): any {
  if (num >= 10000000) {
    return (
      convert_crores(Math.floor(num / 10000000)) +
      " Crore " +
      convert_lakhs(num % 10000000)
    );
  } else {
    return convert_lakhs(num);
  }
}

function convert_lakhs(num: number): any {
  if (num >= 100000) {
    return (
      convert_lakhs(Math.floor(num / 100000)) +
      " Lakh " +
      convert_thousands(num % 100000)
    );
  } else {
    return convert_thousands(num);
  }
}

function convert_thousands(num: number) {
  if (num >= 1000) {
    return (
      convert_hundreds(Math.floor(num / 1000)) +
      " Thousand " +
      convert_hundreds(num % 1000)
    );
  } else {
    return convert_hundreds(num);
  }
}

function convert_hundreds(num: number) {
  if (num > 99) {
    return ones[Math.floor(num / 100)] + " Hundred " + convert_tens(num % 100);
  } else {
    return convert_tens(num);
  }
}

function convert_tens(num: number) {
  if (num < 10) return ones[num];
  else if (num >= 10 && num < 20) return teens[num - 10];
  else {
    return tens[Math.floor(num / 10)] + " " + ones[num % 10];
  }
}

function convert_paise(num: string) {
  if (num === "1") return "Ten";
  if (num === "2") return "Twenty";
  if (num === "3") return "Thirty";
  if (num === "4") return "Forty";
  if (num === "5") return "Fifty";
  if (num === "6") return "Sixty";
  if (num === "7") return "Seventy";
  if (num === "8") return "Eighty";
  if (num === "9") return "Ninety";
  let newNumber = parseInt(num);
  if (newNumber < 10) return ones[newNumber];
  else if (newNumber >= 10 && newNumber < 20) return teens[newNumber - 10];
  else {
    return tens[Math.floor(newNumber / 10)] + " " + ones[newNumber % 10];
  }
}

export default function convertNumberToWords(num: number) {
  if (num == 0) return "Zero";
  let number = num.toString().split(".");

  if (number[1] && number[1] !== "00") {
    let paise = convert_paise(number[1]);
    return `${convert_crores(parseInt(number[0]))} Rupees & ${paise} Paise`;
  }
  return `${convert_crores(num)} Rupees`;
}

//end of conversion code

//testing code begins here

//   function main() {
//     var cases = [
//       0, 1, 2, 7, 10, 11, 12, 13, 15, 19, 20, 21, 25, 29, 30, 35, 50, 55, 69, 70,
//       99, 100, 101, 119, 510, 900, 1000, 5001, 5019, 5555, 10000, 11000, 100000,
//       199001, 1000000, 1111111, 10000000, 11253000,
//     ];
//     for (var i = 0; i < cases.length; i++) {
//       console.log(cases[i] + ": " + convertNumberToWords(cases[i]));
//     }
//   }

//   main();
