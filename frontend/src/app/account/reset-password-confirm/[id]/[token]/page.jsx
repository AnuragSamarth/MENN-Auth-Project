"use client"
import { useFormik } from "formik"
import {resetPasswordConfirmSchema} from "../../../../../validation/schemas"
import { useParams } from "next/navigation"

const initialValues = {
    password: "",
    password_confirmation:""
 }

export default function page(){
    const {id,token} = useParams()
    const {values,errors,handleChange,handleSubmit} = useFormik({
        initialValues,
        validationSchema: resetPasswordConfirmSchema,
        onSubmit: async (values) =>{
           const data = {...values, id, token}
           console.log(data)
        }
      })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300">
        <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your new password"
                />
              {errors.password && <p className="text-sm text-red-500 px-2">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="password_confirmation" className="sr-only">Confirm New Password</label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={values.password_confirmation}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your new password"
                />
              {errors.password_confirmation && <p className="text-sm text-red-500 px-2">{errors.password_confirmation}</p>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}