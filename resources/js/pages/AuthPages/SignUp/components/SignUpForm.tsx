import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import * as yup from "yup";
import { useGuestLoginMutation, useRegisterMutation } from "@/services/identityApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaUserSecret } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store";
import { guestLogin, loginSuccess } from "@/store/slices/authSlice";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [registerUser] = useRegisterMutation();
  const [loginGuest] = useGuestLoginMutation();

  const onSubmit = async (data: any) => {
    registerUser(data)
      .unwrap()
      .then((d: any) => {
        dispatch(loginSuccess(d))
        toast.success("Registration successful!");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Registration failed.");
      });
  }

  const handleGuestLogin = async () => {
    loginGuest()
      .unwrap()
      .then((d: any) => {
        dispatch(loginSuccess(d))
        toast.success("Welcome!");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Registration failed.");
      });
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3  sm:gap-5">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <FaUserSecret />
                Join as Guest
              </button>

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
            <form onSubmit={handleSubmit(onSubmit)} >
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      {...register("first_name")}
                      id="first_name"
                      error={errors.first_name ? true : false}
                      hint={errors.first_name && errors.first_name.message}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      {...register("last_name")}
                      id="last_name"
                      error={errors.last_name ? true : false}
                      hint={errors.last_name && errors.last_name.message}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                {/* <!-- Username --> */}
                <div>
                  <Label>
                    Username<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("username")}
                    id="username"
                    error={errors.username ? true : false}
                    hint={errors.username && errors.username.message}
                    placeholder="Enter your username"
                  />
                </div>
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
                    className="flex items-center justify-center w-full px-4 py-3 border text-sm font-medium text-secondary transition rounded-lg bg-primary uppercase shadow-theme-xs hover:bg-gray-100 hover:text-primary hover:border-primary">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
