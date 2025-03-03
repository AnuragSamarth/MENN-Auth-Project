"use client";

import {
  useGetUserQuery,
  useLogoutUserMutation,
} from "../../../lib/services/auth";
import { Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function page() {
  const { isSuccess, data } = useGetUserQuery();
  const route = useRouter();
  const [user, setUser] = useState({});
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  // console.log(data.user)
  // console.log(user)

  // const user = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   role: "user",
  // };

  const handleLogout = async () => {
    console.log("Logout")
    try {
      const response = await logoutUser();
      if (response.data && response.data.status === "success") {
        toast.success(response.data.message);
        route.push("/");
      }
      if (response.error && response.error.data.status === "failed") {
        console.log("failed");
        toast.error(response.error.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword = () => {
    console.log("Change password");
    route.push("/user/change-password");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              defaultValue={user?.name}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 outline-none"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue={user?.email}
              readOnly
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>

          <div>
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <input
              id="role"
              type="role"
              defaultValue={user?.role}
              readOnly
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Link
            href="/user/change-password"
            className="appearance-none rounded-md w-full border border-gray-300 outline-none flex  justify-center items-center px-3 py-2"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Link>

          <button
            onClick={handleLogout}
            variant="destructive"
            className="w-fullappearance-none rounded-md w-full border border-gray-300 outline-none flex  justify-center items-center px-3 py-2 bg-red-500 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
