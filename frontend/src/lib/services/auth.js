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
            // console.log(user)
            return {
                url: 'verify-email',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
     }),
     loginUser: builder.mutation({
        query: (user) => {
            return {
                url: 'login',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type':'application/json'
                },
                credentials: 'include' // It is required to set cookies
            }
        }
     }),
     getUser: builder.query({
        query: () => {
            return {
                url: 'me',
                method: 'GET',
                credentials: 'include'
            }
        }
     }),
     logoutUser: builder.mutation({
        query: () => {
            return {
                url: 'logout',
                method: 'POST',
                body: {},
                credentials: "include"
            }
        }
     }),
     resetPasswordLink: builder.mutation({
        query: (user) => {
            return {
                url: 'reset-password-link',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type':'application/json'
                }
            }
        }
     })
  }),
})

export const { useCreateUserMutation, useVerifyEmailMutation, useLoginUserMutation,useGetUserQuery, useLogoutUserMutation,useResetPasswordLinkMutation } = authApi