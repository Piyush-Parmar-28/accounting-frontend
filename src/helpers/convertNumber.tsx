function numberWithCommas(x: any) {
  let sign = "";
  if (x < 0) {
    sign = "-";
    x = x.substring(1);
  }
  return (
    sign +
    (x.toString().split(".")[0].length > 3
      ? x
          .toString()
          .substring(0, x.toString().split(".")[0].length - 3)
          .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        x.toString().substring(x.toString().split(".")[0].length - 3)
      : x.toString())
  );
}

export default function convertNumber(num1: any) {
  return num1
    ? Number(num1) > 0 || Number(num1) < 0
      ? Number(Number(num1).toFixed(1)) === Number(num1)
        ? numberWithCommas(num1.toFixed(2))
        : num1.toLocaleString("en-IN")
      : "-"
    : "-";
}
