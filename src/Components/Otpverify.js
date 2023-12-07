import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Otpverify = ({ phoneNumber, requestId }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOTP = async () => {
    try {
      const response = await fetch(
        "https://dev.api.goongoonalo.com/v1/auth/verify_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: "+" + phoneNumber,
            requestId: requestId,
            otp: otp,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        navigate("/homepage", { state: { data } });
        toast.dismiss();
        toast.success("Logged in successfully!");
      } else {
        console.error("OTP verification failed:", data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <div className="w-[420px] text-start">
        <h1 className="signIn text-4xl font-semibold text-[#4c2474] mb-4">
          OTP Verification
        </h1>
        <p className="font-medium text-xs mb-4 leading-3">
          We have sent an OTP to {phoneNumber}. Please enter the code received
          to verify.
        </p>
        <OtpInput
          value={otp}
          numInputs={4}
          separator={<span>&nbsp;&nbsp;</span>}
          isInputNum={true}
          renderInput={(props) => <input {...props} />}
          onChange={(otpValue) => setOtp(otpValue)}
          containerStyle={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            margin: "0.5rem 0",
          }}
          inputStyle={{
            width: "4.5rem",
            height: "76px",
            fontSize: "24px",
            margin: "10px 0",
            borderRadius: "4px 4px 0px 0px",
            border: "1px solid #e7e0ec",
          }}
        />
      </div>
      <button
        onClick={verifyOTP}
        className="h-[50px] w-[420px] text-center bg-[#4c2474] text-[white] font-semibold rounded-lg"
      >
        Verify
      </button>
      <a href="#r" className="text-center text-[#4c2474] underline">
        Resend OTP
      </a>
      <a href="/" className="text-center text-[#4c2474] underline">
        Use another number
      </a>
    </div>
  );
};
