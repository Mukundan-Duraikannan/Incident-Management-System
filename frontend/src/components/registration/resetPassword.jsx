import React,{useState} from "react";
import { resetPassword } from "../services/api";
import Swal from "sweetalert2";
import "./resetPassword.css";

function ResetPassword(){

  const [email,setEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [password,setPassword]=useState("");

  const handleReset = async () => {

    if(!email || !otp || !password){
      Swal.fire("Please fill all fields");
      return;
    }

    try{
      const data = await resetPassword(email,otp,password);
      Swal.fire("Password reset successfull");
    }
    catch(error){
      Swal.fire("Password reset failed");
    }

  };

  return(

    <div className="reset-container">

      <div className="reset-box">

        <h2 className="reset-title">
          Reset Password
        </h2>

        <p className="reset-subtitle">
          Enter OTP and new password
        </p>

        <input type="email" placeholder="Enter your email" className="reset-input" onChange={(e)=>setEmail(e.target.value)}/>
        <input type="text" placeholder="Enter OTP" className="reset-input" onChange={(e)=>setOtp(e.target.value)}/>
        <input type="password" placeholder="Enter new password" className="reset-input" onChange={(e)=>setPassword(e.target.value)}/>

        <button
          className="reset-button"
          onClick={handleReset}
        >
          Reset Password
        </button>

      </div>

    </div>

  );

}

export default ResetPassword;
