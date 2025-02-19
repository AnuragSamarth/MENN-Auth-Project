"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { registerSchema } from "../../../validation/schemas";
import { useCreateUserMutation } from "../../../lib/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function page() {
  const route = useRouter();
  const [createUser] = useCreateUserMutation();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      // console.log(values)
      try {
        const response = await createUser(values);
        // console.log(response)
        if (response.data && response.data.status === "success") {
          toast.success(response.data.message);
          route.push("/account/verify-email");
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

  function handleGoogleLogin(){
    // console.log("handle google login")
    window.open(`https://authapplication.onrender.com/auth/google`, '_self')
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 px-2">{errors.name}</p>
              )}
            </div>
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
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-sm text-red-500 px-2">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={values.password_confirmation}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500 px-2">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Register
            </button>
          </div>

          <div>
            <button className="group relative w-full flex justify-center py-2 px-4 border  text-sm font-medium rounded-md  border-2 border-gray-500 focus:outline-none text-black gap-2" onClick={handleGoogleLogin}>
              <Image
                alt="google"
                src="/google-color-svgrepo.svg"
                width={20}
                height={20}
              />
              <span>Register with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
