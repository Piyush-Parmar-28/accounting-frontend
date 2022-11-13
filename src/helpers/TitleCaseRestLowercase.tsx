// this function also converts second letter of each word to lowercase
export default function TitleCaseRestLowercase(value: string) {
  return value.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}
