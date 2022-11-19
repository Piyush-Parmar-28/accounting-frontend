import { useEffect, useState } from "react";
import TitleCaseRestLowercase from "../helpers/TitleCaseRestLowercase";
import validGSTIN from "../helpers/gstValidate";
import agent from "../agent";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function GSTINBox(props: any) {
  const [value, setValue] = useState("");
  const [gstinDetails, setGstinDetails] = useState({
    gstinname: "",
    gstRegType: "",
    address: "",
    gstRegStatus: "",
    regDate: new Date(),
  });
  const [error, setError] = useState();

  // this useeffect passes the values after it is fetched from api, otherwise it will not be passed until the user types something
  useEffect(() => {
    props.gstinDetails(gstinDetails);
  }, [gstinDetails]);

  const handleChange = (e: any) => {
    setValue(e.target.value.toUpperCase());
    props.onTyping(e.target.value.toUpperCase());

    if (
      e.target.value.length === 15 &&
      validGSTIN(e.target.value.toUpperCase())
    ) {
      agent.Gst.getGst(e.target.value.toUpperCase()).then((res: any) => {
        console.log(res.data);
        if (res.data.name) {
          setGstinDetails((prevState: any) => {
            return {
              ...prevState,
              gstinname: TitleCaseRestLowercase(res.data.name),
            };
          });
        } else {
          setGstinDetails((prevState: any) => {
            return {
              ...prevState,
              gstinname: TitleCaseRestLowercase(res.data.lgnm),
            };
          });
        }
        setGstinDetails((prevState: any) => {
          return {
            ...prevState,
            gstRegType: res.data.gstRegType.toLowerCase(),
          };
        });

        setGstinDetails((prevState: any) => {
          return {
            ...prevState,
            address: `${res.data.address.bno}, ${res.data.address.st}, ${res.data.address.loc}, ${res.data.address.dst}, ${res.data.address.city}, ${res.data.address.pncd}`,
          };
        });
        setGstinDetails((prevState: any) => {
          return { ...prevState, gstRegStatus: res.data.status };
        });
        setGstinDetails((prevState: any) => {
          return { ...prevState, regDate: res.data.rgdt };
        });
      });
    }
  };

  // const focusHandler = (e: any) => {
  //   props.onFocus(true);
  // };

  return (
    <div className="">
      <div className="mt-1 flex rounded-md shadow-sm sm:col-span-2 sm:mt-0">
        <input
          type="text"
          name="company-website"
          id="company-website"
          autoComplete="given-name"
          value={props.value}
          onChange={handleChange}
          // onFocus={focusHandler}
          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* <div>
        {error === "" ? (
          ""
        ) : (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {error}
          </p>
        )}
      </div> */}
    </div>
  );
}
