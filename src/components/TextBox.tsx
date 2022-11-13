import { useState } from "react";
import TitleCase from "../helpers/TitleCase";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function TextBox(props: any) {
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState("");

  const handleChange = (event: any) => {
    let value = TitleCase(event.target.value);

    if (value.length > 50) {
      setError("Maximum permitted length is 50 characters");
      //   value = value.substring(0, 50);
    } else {
      setError("");
    }

    setValue(value);
    props.onTyping(value);
  };

  return (
    <div className="">
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="company-website"
          id="company-website"
          autoComplete="given-name"
          value={props.value}
          onChange={handleChange}
          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2 text-gray-500 sm:text-sm">
          {value.length === 0 ? `0 / 50` : `${value.length} / 50`}
        </span>
      </div>

      <div>
        {error === "" ? (
          ""
        ) : (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
