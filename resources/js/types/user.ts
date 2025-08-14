type UserRole = "user" | "guest" | "admin"
type User = {
    id: number;
    role: UserRole
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
}