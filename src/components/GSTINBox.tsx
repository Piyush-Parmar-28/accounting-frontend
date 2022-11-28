import { useEffect, useState } from "react";
import TitleCaseRestLowercase from "../helpers/TitleCaseRestLowercase";
import validGSTIN from "../helpers/gstValidate";
import agent from "../agent";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../store/types";
import { useParams } from "react-router-dom";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  onNotify: (title: string, message: string, type: string) =>
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        title,
        message,
        type,
      },
    }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  value: string;
  onTyping: (value: string) => void;
  gstinDetails: any;
  organisationId: string;
  duplicateGstinCheck: boolean;
};

export default function GSTINBox(props: Props & PropsFromRedux) {
  const [value, setValue] = useState("");
  const [gstinDetails, setGstinDetails] = useState({
    gstinname: "",
    gstRegType: "",
    address: "",
    gstRegStatus: "",
    gstRegDate: "",
    gstCancelDate: "",
  });
  const [gstinAlreadyPresent, setGstinAlreadyPresent] = useState(false);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // this useeffect passes the values after it is fetched from api, otherwise it will not be passed until the user types something
  useEffect(() => {
    props.gstinDetails(gstinDetails);
  }, [gstinDetails]);

  const handleChange = (e: any) => {
    setError("");
    setValue(e.target.value.toUpperCase());
    props.onTyping(e.target.value.toUpperCase());

    if (
      e.target.value.length === 15 &&
      !validGSTIN(e.target.value.toUpperCase())
    ) {
      setError("GSTIN is not valid.");
    }

    if (
      e.target.value.length === 15 &&
      validGSTIN(e.target.value.toUpperCase())
    ) {
      setError("");
      agent.Gst.getGst(e.target.value.toUpperCase()).then((res: any) => {
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
            gstRegType: res.data.gstRegType,
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
          return { ...prevState, gstRegDate: res.data.rgdt };
        });
        setGstinDetails((prevState: any) => {
          return { ...prevState, gstCancelDate: res.data.cxdt };
        });
      });
    }
  };

  const gstinBlurHandler = (e: any) => {
    console.log("gstin blur");
    console.log("props", props);
    const gstin = e.target.value;

    if (gstin && gstin.length === 15) {
      agent.Account.gstinalreadypresent(props.organisationId, gstin)
        .then((response: any) => {
          console.log("response", response);
          if (response.alreadyPresent) {
            setGstinAlreadyPresent(true);
          } else {
            setGstinAlreadyPresent(false);
          }
        })
        .catch((err: any) => {
          console.log({ err });
        });
    }
  };

  const handleBlur = (e: any) => {
    console.log("blur");
    setShowMessage(false);
    if (
      e.target.value.length === 15 &&
      !validGSTIN(e.target.value.toUpperCase())
    ) {
      setError("GSTIN is not valid.");
    }
    if (e.target.value.length > 0 && e.target.value.length !== 15) {
      setError("GSTIN should be of exact 15 characters.");
    }
    if (props.duplicateGstinCheck) {
      gstinBlurHandler(e);
    }
  };

  return (
    <div>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="company-website"
          id="company-website"
          autoComplete="given-name"
          value={props.value}
          onChange={handleChange}
          onFocus={() => setShowMessage(true)}
          onBlur={handleBlur}
          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2 text-gray-500 sm:text-sm">
          {value.length === 0 ? `0 / 15` : `${value.length} / 15`}
        </span>
      </div>
      {showMessage && (
        <div className="text-sm px-1">
          <p> Enter GSTIN and all GST details will be filled automatically.</p>
        </div>
      )}
      {gstinAlreadyPresent === true ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          An account with same gstin already exists. You can still add this
          account. This is only a warning.
        </p>
      ) : null}
      <div>
        {error && (
          <p className="mt-2 text-sl text-bold text-red-600" id="email-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
