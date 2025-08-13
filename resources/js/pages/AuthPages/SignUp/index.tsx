import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./../AuthPageLayout";
import SignUpForm from "./components/SignUpForm";

export default function SignUp() {
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
