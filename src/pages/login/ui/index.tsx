import { LoginForm } from "./components/login-form";

export function LoginPage() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-2">
			<div className="w-full max-w-3xl">
				<LoginForm />
			</div>
		</div>
	);
}
