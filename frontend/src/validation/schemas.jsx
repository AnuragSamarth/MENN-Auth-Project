import * as Yup from 'yup'


export const registerSchema = Yup.object({
  name: Yup.string().required("name is required"),
  email: Yup.string().required().email(),
  password: Yup.string().required(),
  password_confirmation: Yup.string().required().oneOf([Yup.ref("password"),null], "Password and Confirm Password doesn't match")
})

export const loginSchema = Yup.object({
  email: Yup.string().required().email(),
  password: Yup.string().required()
})

export const resetPasswordSchema = Yup.object({
  email: Yup.string().required().email(),
})

export const resetPasswordConfirmSchema = Yup.object({
  password: Yup.string().required(),
  password_confirmation: Yup.string().required().oneOf([Yup.ref("password"),null], "Password and Confirm Password doesn't match")
})

export const verifyEmailSchema = Yup.object({
  email: Yup.string().required().email(),
  otp: Yup.string().required("OTP is required")
})

export const changePasswordSchema = Yup.object({
  password: Yup.string().required(),
  password_confirmation: Yup.string().required().oneOf([Yup.ref("password"),null], "Password and Confirm Password doesn't match")
})