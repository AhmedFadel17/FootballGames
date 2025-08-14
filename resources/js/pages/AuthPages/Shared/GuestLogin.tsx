
import { FaUserSecret } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store";
import { guestLogin, loginSuccess } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useGuestLoginMutation } from "@/services/identityApi";
export const GuestLogin = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loginGuest] = useGuestLoginMutation();

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
        <button
            type="button"
            onClick={handleGuestLogin}
            className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
            <FaUserSecret />
            Join as Guest
        </button>
    )
}