import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Login.css";
import { Otpverify } from "./Otpverify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestId, setRequestId] = useState("");
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidCountryCode = (code) => {
    return code.trim() !== "";
  };

  const sendOTP = async () => {
    try {
      const countryCode = phoneNumber.split(" ")[0];
      if (isValidCountryCode(countryCode)) {
        setLoading(true);

        const response = await fetch(
          "https://dev.api.goongoonalo.com/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phoneNumber: "+" + phoneNumber,
            }),
          }
        );

        const data = await response.json();

        setRequestId(data.requestId);

        if (response.ok) {
          setLoading(false);
          setShowVerifyOTP(true);
          toast.dismiss();
          toast.success("OTP sent successfully!");
        }
      } else {
        console.error("Invalid country code");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {!showVerifyOTP && (
        <>
          <div className="w-[420px] text-start">
            <h1 className="signIn text-4xl font-semibold text-[#4c2474] mb-4">
              Sign In
            </h1>
            <p className="font-medium text-xs mb-4 leading-3">
              Please enter your mobile number to login. We will send an OTP to
              verify your number.
            </p>
            <PhoneInput
              country={"in"}
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value)}
            />
          </div>
          <button
            onClick={sendOTP}
            className="h-[50px] w-[420px] text-center bg-[#4c2474] text-[white] font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {showVerifyOTP && (
        <Otpverify phoneNumber={phoneNumber} requestId={requestId} />
      )}
    </div>
  );
};
