import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./../AuthPageLayout";
import SignInForm from "./components/SignInForm";
import { useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth])

  return (
    <>
      <PageMeta
        title="Login"
        description="This is Login page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
