import { cookies } from "../cookies";

function _redirect(req: Request) {
	const url = new URL(req.url);

	const redirectUrl = cookies(req, new Headers()).get("redirectUrl")?.value;

	req.headers.append("Location", redirectUrl ?? url.origin);

	const response = new Response(null, {
		status: 302,
		headers: req.headers,
	});

	return response;
}

export const redirect = Object.assign(_redirect, {
	url: "/api/myanimelist/auth/redirect",
});
