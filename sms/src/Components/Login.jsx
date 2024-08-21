import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = ({ handleLogin, getSessionId,getToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [toggleSignup, setToggleSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state variable

  const navigate = useNavigate();

  const handleLoginData = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading


    const data = { email, password };

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", data);
      console.log("Login token",res.data);
      sessionStorage.setItem(res.data.userId, res.data.token);
      const token = sessionStorage.getItem(res.data.userId);

      
      Swal.fire({
        title: res.data.message,
        icon: "success",
        customClass: {
          popup: "bg-white",
          title: "text-black",
        },
        iconColor: "#006400",
      });
      const navEntries = performance.getEntriesByType("navigation");
      
      handleLogin(true);
      getToken(res.data.token)
      getSessionId(res.data.userId);
      navigate("/dashboard");
    } catch (error) {
      handleLogin(true);
      let errorMessage = "An error occurred while attempting to login.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: "error",
        title: errorMessage,
        customClass: {
          popup: "bg-white",
          title: "text-black",
        },
        iconColor: "#8B0000",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/reset_password/request",
        { email }
      );
      setShowOtpForm(true);
      setShowForgetPassword(false);
      setToggleSignup(false);

      Swal.fire({
        title: res.data.message,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/send_otp", {
        email,
      });

      Swal.fire({
        title: res.data.message,
        icon: "success",
      });

      setShowOtpForm(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/verify_otp", {
        email,
        otp,
      });

      Swal.fire({
        title: res.data.message,
        icon: "success",
      });
      setShowChangePasswordForm(true);
      setShowOtpForm(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: "error",
        title: "New password and confirmation password do not match",
      });
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/reset_password", {
        email,
        newPassword,
        confirmNewPassword,
      });

      Swal.fire({
        title: res.data.message,
        icon: "success",
      });

      setEmail("");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOtp("");
      setShowOtpForm(false);
      setShowChangePasswordForm(false);
      resetPasswordFields();
      setToggleSignup(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
        timer: 20,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordInputType = showPassword ? "text" : "password";

  const resetPasswordFields = () => {
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {toggleSignup && (
          <div
            className={`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ${
              showSignup || showForgetPassword ? "hidden" : ""
            }`}
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleLoginData}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <FiMail className="inline-block mr-2" /> Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <FiLock className="inline-block mr-2" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordInputType}
                      name="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    {/* <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div> */}
                  </div> 
                  <Link
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    onClick={() => setShowForgetPassword(true)}
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
                  disabled={isLoading} // Disable button while loading

                >
                      {isLoading ? (
              // Show loading spinner while loading
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              // Show regular text when not loading
              "Sign in"
            )}
          </button>

                 
              </form>
              <NavLink
                className="text-sm font-light text-blue-600 dark:text-blue-500 "
                to="/signup"
              >
                Don’t have an account yet?{" "}
                <button
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up
                </button>
              </NavLink>
            </div>
          </div>
        )}

        <div
          className={`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ${
            showForgetPassword ? "" : "hidden"
          }`}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Password Recovery
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handlePasswordRecovery}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiMail className="inline-block mr-2" /> Your email
                </label>
                <input
                  type="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
              >
                Submit
              </button>
            </form>
            <a
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              onClick={() => setShowForgetPassword(false)}
            >
              Go back to sign in
            </a>
          </div>
        </div>

        {showOtpForm && (
          <div
            className={`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700`}
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Enter OTP
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleVerifyOtp}
              >
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          </div>
        )}

        {showChangePasswordForm && (
          <div
            className={`w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700`}
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleChangePassword}
              >
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Confirm New Password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="mt-3 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-primary-800"
                  onClick={resetPasswordFields}
                >
                  Reset Form
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
