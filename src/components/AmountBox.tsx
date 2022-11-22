import { useState, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { colorsList } from "../constants/colors";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  onChange: (item: any) => void;
  defaultValue: number;
};

export default function AmountBox(props: Props) {
  const [amount, setAmount] = useState("");
  const [amountToShow, setAmountToShow] = useState("");

  useEffect(() => {
    setAmount(props.defaultValue.toString());
    if (props.defaultValue >= 0) {
      let newValue: any = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
      }).format(props.defaultValue);
      setAmountToShow(newValue);
    }
  }, []);

  const handleChange = (e: any) => {
    e.preventDefault();

    // do not allow anything other othan numbers and dot .
    let newValue = e.target.value.replace(
      /([A-Za-z!@#$%^&*()_+=[\]{};':"\\|,<>?~`-])*/g,
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
    setAmount(newValue);
    setAmountToShow(newValue);
    props.onChange(newValue);
  };

  const handleBlur = (e: any) => {
    e.preventDefault();
    let newValue = e.target.value;

    // convert to 00,00,000.00 format and change 5 to 5.00 and 5.1 to 5.10

    if (newValue !== "") {
      newValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
      }).format(newValue);
    }

    setAmountToShow(newValue);
  };

  const handleFocus = (e: any) => {
    e.preventDefault();
    e.target.select();
    let newValue = e.target.value;

    if (newValue !== "") {
      newValue = e.target.value.replace(/,/g, "");

      newValue = Number(newValue).toFixed(2);
      setAmountToShow(newValue);
    }
  };

  return (
    <input
      type="text"
      name="first-name"
      id="first-name"
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      autoComplete="given-name"
      value={amountToShow}
      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
    />
  );
}
