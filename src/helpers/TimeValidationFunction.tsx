import years from "../constants/years";
import months from "../constants/months";

export const validFinYear = (year: string) => {
  if (years.find(yearObj => yearObj.name === year)) {
    return true;
  }
  return false;
};
export const validFinMonth = (month: string) => {
  if (months.find(monthObj => monthObj.name === month)) {
    return true;
  }
  return false;
};
