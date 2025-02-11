"use client";
import Link from "next/link";
import { useFormik } from "formik";
import { verifyEmailSchema } from "../../../validation/schemas";
import { useVerifyEmailMutation } from "../../../lib/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
  otp: "",
};

export default function page() {
    const route = useRouter();
    const [verifyEmail] = useVerifyEmailMutation();
  const { errors, values, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values,action) => {
      // console.log(values)
      try {
        const response = await verifyEmail(values);
        // console.log(response)
        if (response.data && response.data.status === "success") {
          toast.success(response.data.message);
          route.push("/account/login");
          action.resetForm();
        }
        if (response.error && response.error.data.status === "failed") {
          console.log("failed");
          toast.error(response.error.data.message);
          action.resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your account
          </h2>
          <p className="text-sm mt-2">
            Check your email for OTP, OTP is valid for only 15 min.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500 px-2">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="password"
                value={values.otp}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter the OTP"
              />
              {errors.otp && (
                <p className="text-sm text-red-500 px-2">{errors.otp}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
