import { useState, useEffect } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  onChange: (item: any) => void;
  id: string;
  newValue: string;
  negativeAllowed?: boolean | false;
};

export default function AmountBox(props: Props) {
  const [amountToShow, setAmountToShow] = useState("");

  // this will update amount when a row is deleted
  useEffect(() => {
    setAmountToShow(props.newValue);
  }, [props.newValue]);

  const handleChange = (e: any) => {
    e.preventDefault();
    console.log("handleChange", e.target.value);
    // do not allow anything other othan numbers and dot .
    let newValue = !props.negativeAllowed
      ? e.target.value.replace(
          /([A-Za-z!@#$%^&*()_+=[\]{};':"\\|,<>?~`-])*/g,
          ""
        )
      : e.target.value.replace(
          /([A-Za-z!@#$%^&*()_+=[\]{};':"\\|,<>?~`])*/g,
          ""
        );

    const splitNewValue = newValue.split(".");

    // do not allow entering second dot .
    if (splitNewValue.length > 2) {
      newValue = splitNewValue[0] + "." + splitNewValue[1];
    }

    // not letting type more than 2 decimal places
    if (splitNewValue[1] && splitNewValue[1].toString().length > 2) {
      newValue =
        splitNewValue[0] + "." + splitNewValue[1].toString().slice(0, 2);
    }
    // setAmount(newValue);
    console.log("newValue", newValue);
    setAmountToShow(newValue);
    if (newValue !== "-") {
      props.onChange({ newValue, id: props.id });
    }
  };

  const handleBlur = (e: any) => {
    e.preventDefault();
    let newValue = e.target.value;

    // convert to 00,00,000.00 format and change 5 to 5.00 and 5.1 to 5.10

    if (newValue !== "" && newValue !== "-") {
      newValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
      }).format(newValue);
    }
    if (newValue === "-") {
      newValue = "";
    }

    setAmountToShow(newValue);
  };

  const handleFocus = (e: any) => {
    e.preventDefault();
    e.target.select();
    let newValue = e.target.value;

    if (newValue !== "" && newValue !== "-") {
      newValue = e.target.value.replace(/,/g, "");

      newValue = Number(newValue).toFixed(2);
      setAmountToShow(newValue);
    }
  };

  return (
    <input
      type="text"
      name="first-name"
      id={props.id}
      key={props.id}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      autoComplete="off"
      value={amountToShow}
      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm text-right"
    />
  );
}
