import React, { useState } from "react";
import agent from "../../agent";
import validGSTIN from "../../helpers/gstValidate";
import { useNavigate } from "react-router";
import { ADD_NOTIFICATION, LOGIN } from "../../store/types";
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";
import { withRouter } from "../../helpers/withRouter";

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

export const getPreviousFinYear = () => {
  const todayDate6 = new Date();
  todayDate6.setMonth(todayDate6.getMonth() - 12);
  const currentYear = todayDate6.getFullYear();
  const month = todayDate6.toLocaleString("default", { month: "long" });
  if (month === "January" || month === "February" || month === "March") {
    return currentYear - 1 + "-" + (currentYear - 2000);
  }
  return currentYear + "-" + (currentYear + 1 - 2000);
};

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
});

const mapDispatchToProps = (dispatch: any) => ({
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

function AddOrganisation(props: PropsFromRedux) {
  const navigate = useNavigate();

  const initialState = {
    name: "",
    gstRegistered: false,
    gstRegTyp: "",
    gstin: "",
    gstRegState: "",
    startingYear: "",
    mainlyDealing: "",
    trackGoods: false,
    address: "",
    step: 1,
  };

  const [step, setStep] = useState(initialState.step);
  const [name, setName] = useState(initialState.name);
  const [gstRegisterd, setGstRegisterd] = useState(initialState.gstRegistered);
  const [gstRegType, setGstRegType] = useState(initialState.gstRegTyp);
  const [gstin, setGstin] = useState(initialState.gstin);
  const [gstRegState, setGstRegState] = useState(initialState.gstRegState);
  const [startingYear, setStartingYear] = useState(initialState.startingYear);
  const [mainlyDealing, setMainlyDealing] = useState(
    initialState.mainlyDealing
  );
  const [trackGoods, setTrackGoods] = useState(initialState.trackGoods);
  const [address, setAddress] = useState(initialState.address);
  const [gstRegStatus, setGstRegStatus] = useState("");

  //   console.log("name", name);
  //   console.log("gstRegisterd", gstRegisterd);
  //   console.log("gstRegType", gstRegType);
  //   console.log("gstin", gstin);
  //   console.log("gstRegState", gstRegState);
  //   console.log("startingYear", startingYear);
  //   console.log("mainlyDealing", mainlyDealing);
  //   console.log("trackGoods", trackGoods);
  //   console.log("address", address);

  const gstinHandler = (e: any) => {
    setGstin(e.target.value.toUpperCase());

    if (
      e.target.value.length === 15 &&
      validGSTIN(e.target.value.toUpperCase())
    ) {
      agent.Gst.getGst(e.target.value).then((res: any) => {
        if (res.data.name) {
          setName(res.data.name);
        } else {
          setName(res.data.lgnm);
        }
        setGstRegType(res.data.gstRegType.toLowerCase());
        setGstRegState(res.data.gstRegState);
        setAddress(
          `${res.data.address.bno}, ${res.data.address.st}, ${res.data.address.loc}, ${res.data.address.dst}, ${res.data.address.city}, ${res.data.address.pncd}`
        );
        setGstRegStatus(res.data.status);
        setStep(3);
      });
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    if (name === "") {
      (props as any).onNotify(
        "Please enter name",
        "Name is required.",
        "danger"
      );
      return;
    }
    if (gstRegisterd === true && gstin === "") {
      (props as any).onNotify(
        "Please enter GSTIN",
        "GSTIN is required.",
        "danger"
      );
      return;
    }
    if (gstRegisterd === true && gstRegType === "") {
      (props as any).onNotify(
        "Please select GST registration type",
        "GST Registration type is required.",
        "danger"
      );
      return;
    }
    if (startingYear === "") {
      (props as any).onNotify(
        "Please select  first financial year",
        "",
        "danger"
      );
      return;
    }
    if (mainlyDealing === "") {
      (props as any).onNotify("Please select mainly details in", "", "danger");
      return;
    }

    if (trackGoods === false) {
      (props as any).onNotify(
        "Please select track goods/services quantity",
        "",
        "danger"
      );
      return;
    }
    console.log(1);
    agent.Organisation.addOrganisation(
      name,
      gstin,
      gstRegisterd,
      gstRegType,
      startingYear,
      gstRegStatus,
      trackGoods,
      address,
      mainlyDealing
    )
      .then((res: any) => {
        (props as any).onNotify(
          "Organisation added successfully",
          "",
          "danger"
        );
        navigate("/organisations");
        return;
      })
      .catch((err: any) => {
        (props as any).onNotify(
          "Please solve the issues",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
        return;
      });
  };

  return (
    <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5 mx-96 my-12">
        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-3xl font-medium leading-6 text-gray-900 text-center">
              Create an Organisation
              <br />
              <br />
            </h3>
            <p className="mt-1 max-w-2xl text-m text-gray-800">
              If you are registered in GST, just enter GSTIN and we will fetch
              all details
              <br />
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
              <div>
                <div
                  className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                  id="label-notifications"
                >
                  Are you Registered in GST?*
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="max-w-lg">
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="push-everything"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={() => {
                          setGstRegisterd(true);
                          setStep(1);
                        }}
                      />
                      <label
                        htmlFor="push-everything"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="push-email"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={() => {
                          setGstRegisterd(false);
                          setStep(2);
                        }}
                      />
                      <label
                        htmlFor="push-email"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {gstRegisterd ? (
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:pt-5">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  GSTIN*
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    value={gstin}
                    onChange={gstinHandler}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>
            ) : null}

            {step > 2 ? (
              <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                <div>
                  <div
                    className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                    id="label-notifications"
                  >
                    GST Registration Type*
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="max-w-lg">
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="regular"
                          name="push-notifications"
                          type="radio"
                          checked={gstRegType === "regular" ? true : false}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => setGstRegType("regular")}
                        />
                        <label
                          htmlFor="regular"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Regular
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="composition"
                          name="push-notifications"
                          type="radio"
                          checked={gstRegType === "regular" ? false : true}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => setGstRegType("composition")}
                        />
                        <label
                          htmlFor="composition"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Composition
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {step > 1 ? (
              <div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:pt-5 my-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Name*
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:pt-5 my-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Address
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="email"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 my-4">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      <p>First Financial Year*</p>
                    </div>
                    <div
                      className="text-base font-small text-gray-200 sm:text-sm sm:text-gray-500"
                      id="label-notifications"
                    >
                      <p>
                        (from which you want to start accounting in RapidBooks)
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="yearstart"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() =>
                              setStartingYear(getCurrentFinYear())
                            }
                          />
                          <label
                            htmlFor="push-everything"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {getCurrentFinYear()}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="yearstart"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() =>
                              setStartingYear(getPreviousFinYear())
                            }
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {getPreviousFinYear()}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 my-4">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      You mainly deals in*
                    </div>
                    <div
                      className="text-base font-small text-gray-200 sm:text-sm sm:text-gray-500"
                      id="label-notifications"
                    >
                      <p>(we will choose the best settings for you.)</p>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="dealsin"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setMainlyDealing("goods")}
                          />
                          <label
                            htmlFor="push-everything"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Goods
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="dealsin"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setMainlyDealing("services")}
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Services
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="dealsin"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setMainlyDealing("both")}
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Both
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 my-4">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      Track Goods/Services Quantity*
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="trackquantity"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setTrackGoods(true)}
                          />
                          <label
                            htmlFor="push-everything"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="trackquantity"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setTrackGoods(false)}
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            ) : null}
          </div>
        </div>
        {step > 1 ? (
          <div className="pt-5 my-4">
            <div className="flex justify-center">
              {/* <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button> */}
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-12 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={submitHandler}
              >
                Create Organisation
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}

export default compose(
  connector,
  withRouter
)(AddOrganisation) as React.ComponentType;
