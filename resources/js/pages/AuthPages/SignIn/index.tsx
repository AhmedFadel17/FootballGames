import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./../AuthPageLayout";
import SignInForm from "./components/SignInForm";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignIn() {

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated]);

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
