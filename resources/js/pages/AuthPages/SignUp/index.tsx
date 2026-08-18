import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./../AuthPageLayout";
import SignUpForm from "./components/SignUpForm";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SignUp() {
    const navigate = useNavigate();
    const auth = useAuth();
    useEffect(() => {
      if (auth.isAuthenticated) {
        navigate("/");
      }
    }, [auth.isAuthenticated])
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
