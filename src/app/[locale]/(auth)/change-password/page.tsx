import { isTokenValid } from "./actions";
import ChangePasswordForm from "./ChangePasswordForm";
import ResetError from "./ResetError";

export default async function ChangePasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;
	const isValid = await isTokenValid(token || "");

	return (
		<div className="min-h-screen bg-gradient-hero flex flex-col">			
			{isValid.succeeded ? <ChangePasswordForm token={token || ""} /> : <ResetError />}
		</div>
	);
}
