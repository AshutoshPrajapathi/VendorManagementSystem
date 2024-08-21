import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const SignUp = () => {
  const companyNameRef = useRef();
  const emailRef = useRef();
  const contactRef = useRef();
  const locationRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignupData = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      companyname: companyNameRef.current.value,
      email: emailRef.current.value,
      contact: contactRef.current.value,
      location: locationRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        title: res.data.message,
        icon: "success",
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordInputType = showPassword ? "text" : "password";
  const confirmPasswordInputType = showConfirmPassword ? "text" : "password";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div
        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        style={{ maxWidth: "50vw" }}
      >
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignupData}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div>
                <label
                  htmlFor="companyname"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiUser className="mr-2" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Company Name"
                  required
                  ref={companyNameRef}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiMail className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  ref={emailRef}
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiPhone className="mr-2" />
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Contact"
                  required
                  ref={contactRef}
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiMapPin className="mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Location"
                  required
                  ref={locationRef}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiLock className="mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordInputType}
                    name="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    ref={passwordRef}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <FiLock className="mr-2" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordInputType}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    ref={confirmPasswordRef}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
            
            {isSubmitting && (
              <div className="flex justify-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 relative  text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
                disabled={isSubmitting} 
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
          <Link
            to="/login"
            className="text-sm font-light text-center text-blue-600 dark:text-blue-500"
          >
            <div className="flex justify-center">
              {" "}
              Already have an account?{" "}
              <button className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Sign in
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
