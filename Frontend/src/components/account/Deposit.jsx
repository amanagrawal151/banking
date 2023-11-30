import React, { useState, useEffect } from "react";
import { FcDonate } from "react-icons/fc";
import { HiReceiptRefund } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  deposit,
  resetAccountStatus,
} from "../../state/features/Account/accountSlice";
import { PaymentMethods } from "../payment/PaymentMethods";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { UseResetStatus } from "../../hooks/UseResetStatus";

export const Deposit = () => {
  //state for withdraw balance
  const [depositAmount, setDepositAmount] = useState(100);

  //state for user password
  const [password, setPassword] = useState("");

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { account, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.userAccount
  );
  const { user } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess) {
      setMsg(
        `You Have Deposited ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(depositAmount)} into your Account Successfully!`
      );
    }
  }, [isError, isSuccess, message, account, msg]);

  //get account id
  const accountId = useLocation().pathname.split("/").at(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const withdrawData = {
      accountId,
      depositAmount,
      token: user.token,
      oldPassword: password,
      id: user.id,
    };
    dispatch(deposit(withdrawData));
  };

  UseResetStatus(() => {
    return () => {
      dispatch(resetAccountStatus());
    };
  });

  return (
    <div className="max-w-5xl w-full">
      <h3 className="flex justify-center items-center text-2xl text-center font-bold px-2 py-4 mb-10 bg-blue-200 border-b-4 border-blue-800 rounded shadow ">
        <FcDonate className="mr-1" size={50} />
        Deposit Money
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 mb-2 p-2">
          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0  p-2 border-r-4 rounded shadow bg-blue-200 border-blue-800"
            htmlFor="depositAmount"
          >
            Enter Deposit Amount
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
            type="number"
            name="depositAmount"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            min="100"
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0  p-2 border-r-4 rounded shadow bg-blue-200 border-blue-800"
            htmlFor="password"
          >
            Type your Password
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <PaymentMethods title="Deposit Methods" />

        {/*Request Status and Errors*/}
        {(isError || isSuccess) && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        {/*form button */}
        <FormButton
          text={{ default: "Deposit", loading: "Processing" }}
          isLoading={isLoading}
          icon={<HiReceiptRefund className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
};
