import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./../AuthPageLayout";
import SignUpForm from "./components/SignUpForm";
import { useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SignUp() {
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
        title="SignUp"
        description="This is the SignUp page for Football Games Dashboard"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
