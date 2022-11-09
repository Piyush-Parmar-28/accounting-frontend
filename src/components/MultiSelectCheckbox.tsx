import { useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

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

export default function MultiSelectCheckbox(props: Props) {
  const [query, setQuery] = useState("");
  const options = props.items;

  const onChange = (item: any) => {
    props.onChange(item[0]);
  };

  const filteredoptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  const displayCheckedValue = () => {
    if (props.type === "Tasks") {
      const index = props.selected.findIndex(
        (item: any) => item.name === "ALL"
      );
      if (index === -1) {
        return props.selected.map((item: any) => item.name).join(", ");
      } else {
        return "ALL";
      }
    } else {
      return props.selected.map((item: any) => item.name).join(", ");
    }
  };

  return (
    <Combobox as="div" value={[]} onChange={onChange} multiple>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {props.heading}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          displayValue={() => displayCheckedValue()}
          placeholder={props.placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredoptions?.length > 0 && (
          <Combobox.Options
            className={
              "max-h-40 absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            }
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
                <>
                  <div className="flex items-center">
                    <span>
                      <input
                        id={"checkbox"}
                        name={"checkbox"}
                        type="checkbox"
                        style={{ border: "solid 1px #d1d5db" }}
                        className="focus:ring-indigo-500 mr-3 h-4 w-4 text-indigo-600 rounded border-gray-400"
                        checked={
                          props.selected.findIndex(
                            (item: any) => item._id === option._id
                          ) !== -1
                        }
                        onChange={() => null}
                      />
                    </span>

                    <span className={"block truncate"}>{option.name}</span>
                  </div>
                </>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
