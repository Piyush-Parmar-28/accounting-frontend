import { format } from "date-fns";

export const formatDate = (date: any, reversed: boolean) => {
  let formattedDate = new Date(date);
  if (formattedDate.toLocaleString() !== "Invalid Date") {
    return reversed
      ? format(formattedDate, "yyyy-MM-dd")
      : format(formattedDate, "dd-MM-yyyy");
  } else {
    return date;
  }
};

export const formatDateAndTime = (date: any) => {
  let formattedDate = new Date(date);
  if (formattedDate.toLocaleString() !== "Invalid Date") {
    return format(formattedDate, "dd-MM-yyyy p");
  } else {
    return date;
  }
};
