import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// console.log(process.env.BACKEND_HOST)
// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }),
  endpoints: (builder) => ({
     createUser: builder.mutation({
        query: (user) => {
            // console.log("Create User Data",user);
            return {
                url:'register',
                method:'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
     }),
     verifyEmail: builder.mutation({
        query: (user) => {
            console.log(user)
            return {
                url: 'verify-email',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
     })
  }),
})

export const { useCreateUserMutation, useVerifyEmailMutation  } = authApi