/** For gstin validation **/
var GSTINFormat =
  "[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}";
var GSTN_CODEPOINT_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** For gstin validation **/

/** GSTIN validation functions start here */
export default function validGSTIN(gstin: string) {
  var isValidFormat = false;
  if (checkPattern(gstin, GSTINFormat)) {
    isValidFormat = verifyCheckDigit(gstin);
  }
  return isValidFormat;
}

function verifyCheckDigit(gstin: string) {
  var isCDValid = false;
  var newGstninWCheckDigit = getGSTINWithCheckDigit(
    gstin.substr(0, gstin.length - 1)
  );
  if (gstin.trim() === newGstninWCheckDigit) {
    isCDValid = true;
  }
  return isCDValid;
}

function checkPattern(inputval: string, regxpatrn: string) {
  var result = false;
  var input = inputval.trim();
  if (input.match(regxpatrn)) {
    result = true;
  }
  return result;
}

function getGSTINWithCheckDigit(gstinWOCheckDigit: string) {
  var factor = 2;
  var sum = 0;
  var checkCodePoint = 0;
  var cpChars = [];
  var inputChars = [];
  if (gstinWOCheckDigit == null) {
    console.log("GSTIN supplied for checkdigit calculation is null.");
  }
  cpChars = GSTN_CODEPOINT_CHARS.split("");
  inputChars = gstinWOCheckDigit.trim().toUpperCase().split("");
  var mod: any = cpChars.length;
  for (var i = inputChars.length - 1; i >= 0; i--) {
    var codePoint = -1;
    for (var j = 0; j < cpChars.length; j++) {
      if (cpChars[j] === inputChars[i]) {
        codePoint = j;
      }
    }

    var digit: any = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    var calc1: any = parseInt(digit) / parseInt(mod);
    var calc2: any = parseInt(digit) % parseInt(mod);
    digit = parseInt(calc1) + parseInt(calc2);
    sum += digit;
  }
  checkCodePoint = (mod - (sum % mod)) % mod;
  return gstinWOCheckDigit + cpChars[checkCodePoint];
}
