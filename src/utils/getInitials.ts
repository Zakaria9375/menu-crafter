import { Session } from "next-auth";

export 	const getInitials = (user: Session["user"]) => {
	if (user?.name?.includes(" ")) {
		return user?.name?.split(" ")[0][0] + user?.name?.split(" ")[1][0];
	}
	return user?.name?.[0] ?? "";
	}
