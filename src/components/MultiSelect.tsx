import { useState, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { colorsList } from "../constants/colors";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  heading?: string;
  items: { [key: string]: any }[];
  selected: { [key: string]: any };
  type: string;
  defaultValue?: string;
  placeholder?: string;
  onChange: (item: any) => void;
};

export default function MultiSelect(props: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(props.selected);
  const options = props.items;
  const selectedColor: any = colorsList?.find(
    (color: any) => color.name === props.selected.name
  );

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const onChange = (item: any) => {
    setSelected(props.selected);
    props.onChange(item);
  };

  const filteredoptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selected.name} onChange={onChange}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {props.heading}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          style={{
            backgroundColor:
              props.type === "colors" ? selectedColor?.value : "white",
            color:
              props.type === "colors" && props.selected.name.includes("Dark")
                ? "white"
                : "black",
          }}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event: any) => {
            setQuery(event.target.value);
          }}
          displayValue={props.selected.name}
          placeholder={props.placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className={`h-5 w-5 ${
              props.type === "colors" && props.selected.name.includes("Light")
                ? "text-gray-500"
                : "text-gray-400"
            } ${props.type !== "colors" ? "text-gray-400" : ""}`}
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredoptions?.length > 0 && (
          <Combobox.Options
            className={`${
              props.type === "organisations" ? "max-h-120" : "max-h-40"
            } absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
          >
            {filteredoptions?.map((option) => (
              <Combobox.Option
                key={option._id}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      {props.type === "colors" && (
                        <span
                          style={{ background: option.value }}
                          className={
                            "inline-block h-4 w-4 mr-3 bg-indigo-600 flex-shrink-0 rounded-full border border-slate-300"
                          }
                          aria-hidden="true"
                        />
                      )}

                      <span
                        className={classNames(
                          "block truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {option.name}
                        {option.name === props.selected.name ? (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              active ? "text-white" : "text-indigo-600"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
