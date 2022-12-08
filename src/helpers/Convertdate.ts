export function convertDateToString(date: string) {
  const splitdate = date.split("-");
  const day = splitdate[2].substring(0, 2);
  const month = splitdate[1];
  const year = splitdate[0];

  return `${day}-${month}-${year}`;
}
