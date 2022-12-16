import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import agent from "../agent";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../store/types";

// should open on click on anywhere in dropdown
// first option of add new account
// remove static companyId
// filter account list on basis of nature
// open when focused
// if i selected an account, i cannot remove it

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

type Props = {
  onSelection?: (forSearch: boolean) => void;
  id?: any;
  newAccount?: any;
  filterByNature?: string[];
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function AccountList(props: Props & PropsFromRedux) {
  const [query, setQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState({});

  // this will update account when a row is deleted
  useEffect(() => {
    setSelectedAccount(props.newAccount);
  }, [props.newAccount]);

  let accounts = (props as any).accounts;

  useEffect(() => {
    if ((props as any).id === (props as any).deletedAccountId) {
      setSelectedAccount({});
    }
  }, [(props as any).onAccountChange]);

  let filteredAccounts = [];
  let filteredByNature = [];
  if (accounts !== undefined) {
    if (
      props.filterByNature !== undefined &&
      !props.filterByNature?.includes("All")
    ) {
      filteredByNature = accounts.filter((account: any) => {
        const nature: string = account.nature;
        if (props.filterByNature?.includes(nature)) {
          return true;
        }
        return false;
      });
    } else {
      filteredByNature = accounts;
    }
    filteredAccounts =
      query === ""
        ? filteredByNature
        : filteredByNature.filter((account: any) => {
            return account.name.toLowerCase().includes(query.toLowerCase());
          });
  }

  const clearFilter = () => {
    setQuery("");
    filteredAccounts = accounts;
  };

  const onChangeHandler = (e: any) => {
    if (e === "No Account Found") {
      return;
    }
    if (e === "Add New Account") {
      console.log("open new account");
      openAddAccountModal();
      return;
    }
    setSelectedAccount(e);
    e.id = (props as any).id;
    (props as any).onSelection({ account: e });
  };

  const openAddAccountModal = () => {
    (props as any).updateCommon({
      currentModal: {
        modalName: "ADD_ACCOUNT_MODAL",
        fetchAgain: false,
        type: "add",
        data: "",
      },
    });
  };

  return (
    <Combobox as="div" value={selectedAccount} onChange={onChangeHandler}>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(account: any) => account?.name}
          placeholder="Select Account"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
            onClick={clearFilter}
          />
        </Combobox.Button>

        {filteredAccounts.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Combobox.Option
              key={2}
              value={"Add New Account"}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              + Add New Account
            </Combobox.Option>
            {filteredAccounts.map((account: any) => (
              <Combobox.Option
                key={account._id}
                value={account}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                    <div className="flex  justify-between mx-3">
                      <span
                        className={classNames(
                          "truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {account.name}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 truncate text-gray-500 -mr-10",
                          active ? "text-indigo-200" : "text-gray-500"
                        )}
                      >
                        {account.nature}
                      </span>
                    </div>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}

        {filteredAccounts.length === 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Combobox.Option
              key={2}
              value={"Add New Account"}
              // onClick={openAddAccountModal}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              + Add New Account
            </Combobox.Option>
            <Combobox.Option
              key={1}
              value={"No Account Found"}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9"
                  // active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              No Account Found
            </Combobox.Option>
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export default connector(AccountList);
