"use client";

import { useState, type FormEvent } from "react";

export default function AuthPanel() {
  const [signingUp, setSigningUp] = useState(false);
  const [message, setMessage] = useState("");

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(signingUp ? "Account registration is not connected yet." : "Sign-in is not connected yet.");
  }

  function changeMode(nextMode: boolean) {
    setSigningUp(nextMode);
    setMessage("");
  }

  return (
    <div className="grid w-[90%] max-w-300 overflow-hidden rounded-[22px] bg-[#dfe6fb] shadow-[0_24px_60px_rgba(10,15,48,0.18)] md:min-h-140 md:grid-cols-2">
      <div className={`order-2 flex items-center justify-center px-6 py-12 sm:px-12 md:order-1 ${signingUp ? "md:order-2" : ""}`}>
        <div className="w-full max-w-90">
          <h1 className="text-center text-3xl font-bold tracking-normal text-[#10152f] sm:text-[34px]">
            {signingUp ? "Create Account" : "Sign In"}
          </h1>
          <button
            type="button"
            onClick={() => setMessage("Google sign-in is not connected yet.")}
            className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/35 text-xs font-medium text-[#11172e] transition hover:bg-white/60"
          >
            <span aria-hidden="true" className="text-base font-bold text-[#4285f4]">G</span>
            Sign In with Google
          </button>
          <p className="my-5 text-center text-sm font-semibold text-[#4f5872]">
            {signingUp ? "Register with E-mail" : "sign in with Email & Password"}
          </p>
          <form className="space-y-3" onSubmit={submitForm}>
            {signingUp && (
              <input
                aria-label="Name"
                autoComplete="name"
                className="h-10.5 w-full rounded-full bg-[#f0f0f0] px-4 text-sm text-[#10152f] outline-none placeholder:text-[#7c818b] focus:ring-2 focus:ring-[#16106f]"
                name="name"
                placeholder="Name"
                required
              />
            )}
            <input
              aria-label="Email address"
              autoComplete="email"
              className="h-10.5 w-full rounded-full bg-[#f0f0f0] px-4 text-sm text-[#10152f] outline-none placeholder:text-[#7c818b] focus:ring-2 focus:ring-[#16106f]"
              name="email"
              placeholder="Enter your email"
              required
              type="email"
            />
            <input
              aria-label="Password"
              autoComplete={signingUp ? "new-password" : "current-password"}
              className="h-10.5 w-full rounded-full bg-[#f0f0f0] px-4 text-sm text-[#10152f] outline-none placeholder:text-[#7c818b] focus:ring-2 focus:ring-[#16106f]"
              name="password"
              placeholder="Enter password"
              required
              type="password"
            />
            <button
              className="mx-auto mt-10 flex h-11 min-w-33.5 items-center justify-center rounded-full bg-[#10086d] px-8 text-xs font-semibold text-white transition hover:bg-[#09064c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10086d]"
              type="submit"
            >
              {signingUp ? "SIGN UP" : "SIGN IN"}
            </button>
          </form>
          {message && <p aria-live="polite" className="mt-4 text-center text-sm text-[#37415f]">{message}</p>}
        </div>
      </div>

      <div className={`order-1 flex min-h-65 items-center justify-center bg-[#050638] px-6 py-12 text-center text-white shadow-[0_18px_36px_rgba(0,0,0,0.24)] md:order-2 md:min-h-0 ${signingUp ? "md:order-1" : ""}`}>
        <div className="max-w-85">
          <h2 className="text-3xl font-semibold leading-[1.05] sm:text-[34px]">
            {signingUp ? "Welcome back!" : <>Welcome To<br />BOB TRONICS!</>}
          </h2>
          <p className="mt-4 text-sm font-medium text-white/80">
            {signingUp ? "Sign in with Email & Password" : "Sign up now and enjoy our site"}
          </p>
          <button
            type="button"
            onClick={() => changeMode(!signingUp)}
            className="mt-6 h-11 min-w-34 rounded-full border border-white px-8 text-xs font-semibold text-white transition hover:bg-white hover:text-[#050638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {signingUp ? "SIGN IN" : "SIGN UP"}
          </button>
        </div>
      </div>
    </div>
  );
}