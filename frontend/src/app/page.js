import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <main className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Welcome to PassportJS + JWT Authentication</h1>
        <h2 className="text-2xl font-semibold mb-8 text-gray-700">Handle Access Token and Refresh Token on Server</h2>
        <p className="mb-8 text-gray-600 max-w-md mx-auto">
          Secure your application with industry-standard authentication. Manage tokens efficiently for a seamless user
          experience.
        </p>
        <div className="space-x-4">
          <button asChild className="border-2 border-gray-500 rounded-md p-3">
            <Link href="/account/login">Get Started</Link>
          </button>
          <button asChild className="border-2 border-gray-500 rounded-md p-3">
            <Link href="/">Learn More</Link>
          </button>
        </div>
      </main>
      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
}
