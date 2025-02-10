'use client'
import { useFormik } from "formik"
import {resetPasswordSchema} from "../../../validation/schemas"

const initialValues = {
   email: ""
}

export default function page(){

    const {values,errors,handleChange,handleSubmit} = useFormik({
      initialValues,
      validationSchema: resetPasswordSchema,
      onSubmit: async (values) =>{
        console.log(values)
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
              {errors.email && <p className="text-sm text-red-500 px-2">{errors.email}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}