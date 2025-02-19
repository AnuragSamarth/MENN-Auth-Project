"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "../../../validation/schemas";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "../../../lib/services/auth";
import { toast } from "react-toastify";
import Image from "next/image";

const initialValues = {
  email: "",
  password: "",
};

export default function page() {
  const route = useRouter();
  const [loginUser] = useLoginUserMutation();
  const { errors, values, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      // console.log(values)
      try {
        const response = await loginUser(values);
        if (response.data && response.data.status === "success") {
          toast.success(response.data.message);
          route.push("/user/profile");
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
    window.open(`https://authapplication.onrender.com/auth/google`, '_self')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/account/reset-password-link"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button className="group relative w-full flex justify-center py-2 px-4 border  text-sm font-medium rounded-md border-2 border-gray-500 focus:outline-none text-black gap-2" onClick={handleGoogleLogin}>
              <Image
                alt="google"
                src="/google-color-svgrepo.svg"
                width={20}
                height={20}
              />
              <span>Login with Google</span>
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/account/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
