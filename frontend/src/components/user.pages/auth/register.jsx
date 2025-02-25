import { useState } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../../../axiosinstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const initialValues = {
  name: "",
  email: "",
  password: "",
  cpassword: "",
};

//confirmPassword

const Register = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (step === 1) {
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
    } else if (step === 2) {
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else if (!/[a-zA-Z]/.test(values.password)) {
        errors.password = "Password must contain at least 1 letter";
      } else if (!/[0-9]/.test(values.password)) {
        errors.password = "Password must contain at least 1 number";
      }
      if (!values.cpassword) {
        errors.cpassword = "Confirm password is required";
      } else if (values.cpassword !== values.password) {
        errors.cpassword = "Passwords do not match";
      }
    } else if (step === 3) {
      if (!values.name) {
        errors.name = "Name is required";
      } else if (values.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setIsLoading(true);
        setApiError(null);
        try {
          const response = await axiosInstance.post("/user/register", values);
          toast.success("Registration successful!");
          formik.resetForm();
          navigate("/otp");
          console.log(response);
        } catch (error) {
          setApiError(error.response?.data?.message || "Something went wrong");
          setIsLoading(false);
        }
      }
    },
  });
  //Sign up to start listening
  const passwordConditions = {
    length: formik.values.password.length >= 8,
    letter: /[a-zA-Z]/.test(formik.values.password),
    number: /[0-9]/.test(formik.values.password),
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-2 text-amber-50"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@domain.com"
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-400 text-sm mt-2">{formik.errors.email}</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2 text-amber-50"
              >
                Create a password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-400 text-sm mt-2">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="text-xs text-neutral-400 space-y-1">
              <p>Password must contain:</p>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    passwordConditions.length
                      ? "bg-green-500"
                      : "bg-neutral-700"
                  }`}
                >
                  {passwordConditions.length && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </span>
                <p>8+ characters</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    passwordConditions.letter
                      ? "bg-green-500"
                      : "bg-neutral-700"
                  }`}
                >
                  {passwordConditions.letter && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </span>
                <p>1 letter</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    passwordConditions.number
                      ? "bg-green-500"
                      : "bg-neutral-700"
                  }`}
                >
                  {passwordConditions.number && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </span>
                <p>1 number</p>
              </div>
            </div>
            <div>
              <label
                htmlFor="cpassword"
                className="block text-sm font-bold mb-2 text-amber-50"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="cpassword"
                  value={formik.values.cpassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.errors.cpassword && formik.touched.cpassword && (
                <p className="text-red-400 text-sm mt-2">
                  {formik.errors.cpassword}
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold mb-2 text-amber-50"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="This name will appear on your profile"
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-400 text-sm mt-2">{formik.errors.name}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d2b] to-[#191414] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-lg p-8">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
              alt="Spotify Logo"
              className="w-32 mx-auto mb-6"
            />
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Sign up to start listening
          </h1>
          <p className="text-neutral-400 mt-2">Step {step} of 3</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {renderStep()}
          {apiError && (
            <div className="bg-red-900/50 text-red-400 p-4 rounded-lg text-sm">
              {apiError}
            </div>
          )}
          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-full py-3 rounded-full bg-black text-white font-bold hover:bg-neutral-800 transition-all"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={`w-full py-3 rounded-full font-bold text-lg ${
                isLoading
                  ? "bg-green-600 opacity-70"
                  : "bg-green-500 hover:bg-green-400 hover:scale-105"
              } transition-all`}
              disabled={isLoading || Object.keys(formik.errors).length > 0}
            >
              {isLoading
                ? "Processing..."
                : step === 3
                ? "Create account"
                : "Next"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-white hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
