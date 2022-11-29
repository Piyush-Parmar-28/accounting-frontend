import React, { useState } from "react";
import { format } from "date-fns";

// set props.onblurfunction for each error

const getCurrentFinYear = () => {
  const todayDate5 = new Date();
  todayDate5.setMonth(todayDate5.getMonth());
  const currentYear = todayDate5.getFullYear();
  const month = todayDate5.toLocaleString("default", { month: "long" });
  if (month === "January" || month === "February" || month === "March") {
    return currentYear - 1 + "-" + (currentYear - 2000);
  }
  return currentYear + "-" + (currentYear + 1 - 2000);
};

export const periodDetails = (finYear: any) => {
  const finYearArray = finYear.split("-");
  const startDate = new Date(finYearArray[0], 3, 1);
  const endDate = new Date(parseInt(finYearArray[1]) + 2000, 2, 31);

  return {
    startDate,
    endDate,
  };
};

const getDayfromDate = (date: Date) => {
  const day: number = date.getDay();
  if (day === 0) {
    return "Sunday";
  }
  if (day === 1) {
    return "Monday";
  }
  if (day === 2) {
    return "Tuesday";
  }
  if (day === 3) {
    return "Wednesday";
  }
  if (day === 4) {
    return "Thursday";
  }
  if (day === 5) {
    return "Friday";
  }
  if (day === 6) {
    return "Saturday";
  }
};

type Props = {
  currentYear: string;
  onBlurrFunction: (item: any) => void;
};

export default function DateComponent(props: Props) {
  const today = new Date();
  let currentYearDetails: any;
  if (props.currentYear) {
    currentYearDetails = periodDetails(props.currentYear);
  }

  const formatedTodayDate = format(today, "dd-MM-yyyy");

  const stringDate = formatedTodayDate.toString();
  const todayDay = getDayfromDate(today);
  const [startDate, setStartDate] = useState(stringDate);
  const [oldDate, setoldDate] = useState(stringDate);
  const [day, setDay] = useState(todayDay);
  const [error, setError] = useState("");

  const onChangeHandler = (e: any) => {
    const newValue = e.target.value.replace(
      /([A-Za-z!@#$%^&*()_+=[\]{};':"\\|,<>?~`])*/g,
      ""
    );

    setStartDate(newValue);
  };

  const onBlurHandler = (e: any) => {
    const date = e.target.value;

    // if date is deleted and clicked outside then set old date as date
    if (date === "") {
      setStartDate(oldDate);
      return;
    }
    const currentYear = getCurrentFinYear();
    let newDate = "";
    // split date into array
    let splitDate = [];
    if (date.includes("-")) {
      splitDate = date.split("-");
    } else if (date.includes("/")) {
      splitDate = date.split("/");
    } else if (date.includes(".")) {
      splitDate = date.split(".");
    } else {
      splitDate = [date];
    }

    // if 5. or 5- is entered then second index gets generated as blank string so it is removed same for 5.12. or 5-12- or if only . is entered
    if (splitDate[0] === "") {
      splitDate.splice(0, 1);
      setStartDate(oldDate);
      return;
    }
    if (splitDate[1] === "") {
      splitDate.splice(1, 1);
    }
    if (splitDate[2] === "") {
      splitDate.splice(2, 1);
    }

    // check for errors

    if (splitDate[0].length > 2) {
      setError("Invalid Date - Date cannot be more than 2 digits.");
      props.onBlurrFunction({
        error: "Invalid Date - Date cannot be more than 2 digits.",
      });
      return;
    }
    if (splitDate[1] && splitDate[1].length > 2) {
      setError("Invalid Date - Month cannot be more than 2 digits.");
      return;
    }
    if (splitDate[2] && splitDate[2].length > 4) {
      setError("Invalid Date - Year cannot be more than 4 digits.");
      return;
    }
    if (splitDate[0] > 31) {
      setError("Invalid Date");
      return;
    }
    if (splitDate[1] && splitDate[1] > 12) {
      setError("Invalid Date");
      return;
    }
    if (
      splitDate[1] &&
      splitDate[0] > 30 &&
      (splitDate[1] === 4 ||
        splitDate[1] === 6 ||
        splitDate[1] === 9 ||
        splitDate[1] === 11)
    ) {
      setError("Invalid Date");
      return;
    }

    // check for error ends

    // if date, month and year is provided
    if (splitDate.length === 3) {
      const date = splitDate[0];
      const month = splitDate[1];
      const year = splitDate[2];
      newDate = date + "-" + month + "-" + year;
    }
    // if date and month is provided
    if (splitDate.length === 2) {
      const date = splitDate[0];
      const month = splitDate[1];

      if (month > 3) {
        newDate = `${date}-${month}-${currentYear.split("-")[0]}`;
      } else {
        newDate = `${date}-${month}-${parseInt(currentYear.split("-")[0]) + 1}`;
      }
    }

    // if only date  is provided
    if (splitDate.length === 1) {
      const date = splitDate[0];

      const month = parseInt(oldDate.split("-")[1]);

      if (month > 3) {
        newDate = `${date}-${month}-${currentYear.split("-")[0]}`;
      } else {
        newDate = `${date}-${month}-${parseInt(currentYear.split("-")[0]) + 1}`;
      }
    }

    let finalDateSplit = newDate.split("-");

    // convert 1 digit date to 2 digit date
    if (finalDateSplit[0].length === 1) {
      newDate =
        "0" +
        finalDateSplit[0] +
        "-" +
        finalDateSplit[1] +
        "-" +
        finalDateSplit[2];
    }

    // convert 1 digit month to 2 digit month
    if (finalDateSplit[1].length === 1) {
      // newDate.split is used again becuase if date and month both are 1 digit then date gets to one digit again if finalDateSplit is used
      newDate =
        newDate.split("-")[0] +
        "-0" +
        finalDateSplit[1] +
        "-" +
        finalDateSplit[2];
    }

    // convert 2 digit year to 4 digit year
    if (finalDateSplit[2].length === 2) {
      // newDate.split is used again becuase if date and month both are 1 digit then date gets to one digit again if finalDateSplit is used
      newDate =
        newDate.split("-")[0] +
        "-" +
        newDate.split("-")[1] +
        +"-20" +
        finalDateSplit[2];
    }

    // check for errors

    const lastDateSplit = newDate.split("-");

    const lastDate = parseInt(lastDateSplit[0]);
    const lastMonth = parseInt(lastDateSplit[1]);
    const lastYear = parseInt(lastDateSplit[2]);

    if (lastDate > 31) {
      setError("Invalid Date");
      return;
    }
    if (lastMonth > 12) {
      setError("Invalid Date");
      return;
    }
    if (
      lastDate > 30 &&
      (lastMonth === 4 ||
        lastMonth === 6 ||
        lastMonth === 9 ||
        lastMonth === 11)
    ) {
      setError("Invalid Date");
      return;
    }
    if (lastDate > 28 && lastMonth === 2 && lastYear % 4 !== 0) {
      setError("Invalid Date");
      return;
    }
    if (lastDate > 29 && lastMonth === 2 && lastYear % 4 === 0) {
      setError("Invalid Date");
      return;
    }
    // check for error ends

    const dateSplited = newDate.split("-");

    const newDateInDateFormat = new Date(
      parseInt(dateSplited[2]),
      parseInt(dateSplited[1]) - 1,
      parseInt(dateSplited[0])
    );

    // check that date within current financial year
    let resetError = true;
    if (newDateInDateFormat > currentYearDetails.endDate) {
      setError("Date should be within current financial year.");
      resetError = false;
    }
    if (newDateInDateFormat < currentYearDetails.startDate) {
      setError("Date should be within current financial year.");
      resetError = false;
    }

    const day = getDayfromDate(newDateInDateFormat);

    setDay(day);
    setStartDate(newDate);
    props.onBlurrFunction({ date: newDate });
    setoldDate(newDate);
    if (resetError) {
      setError("");
    }
  };

  return (
    <div>
      <div className="relative mt-1 rounded-md shadow-sm">
        {/* {
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">Rs.</span>
          </div>
        } */}
        <div className="mx-2">
          <input
            autoFocus
            value={startDate}
            onChange={(e) => onChangeHandler(e)}
            onBlur={(e) => onBlurHandler(e)}
            onFocus={(e) => e.target.select()}
            type="text"
            id="text"
            className="block w-full rounded-md border-gray-300 pr-24 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right"
            placeholder="Date"
            aria-describedby="price-currency"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 mx-2">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {day}
          </span>
        </div>
      </div>
      <div>{error && `${error}`}</div>
    </div>
  );
}
