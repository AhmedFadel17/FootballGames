import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { GuestLogin } from "../../Shared/GuestLogin";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

/**
 * SignInForm
 *
 * Authentication is handled by a two-step PKCE flow:
 * 1. POST to /auth/login (backend session authentication) which sets the session cookie.
 * 2. On success, call auth.signinRedirect() to redirect to Passport's /oauth/authorize.
 *    Since the session is now active, Passport completes the flow automatically and
 *    redirects to /callback to exchange the authorization code for the tokens.
 */
export default function SignInForm() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    await toast.promise(
      fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw err;
        }
        return res.json();
      }),
      {
        loading: "Signing in...",
        success: "Session authenticated! Redirecting to secure login...",
        error: (err: any) => err?.message || "Invalid credentials",
      }
    ).then(() => {
      // Trigger Passport's authorize redirect (silent/auto-approved since we have a session cookie now)
      auth.signinRedirect();
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in securely to your Football Games account.
            </p>
          </div>
          <div>
            {/* Guest Login option */}
            <div className="grid grid-cols-1">
              <GuestLogin />
            </div>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("email")}
                    id="email"
                    error={errors.email ? true : false}
                    hint={errors.email && errors.email.message}
                    placeholder="Enter your E-mail"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      id="password"
                      error={errors.password ? true : false}
                      hint={errors.password && errors.password.message}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || auth.isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 border text-sm font-medium text-secondary transition rounded-lg bg-primary uppercase shadow-theme-xs hover:bg-gray-100 hover:text-primary hover:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || auth.isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
