import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "~/env";

export const GET = (req: NextRequest) => {
	if (req.headers.get("Authorization") !== env.HEALTHCHECK_KEY) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	return NextResponse.json({
		success: true,
	});
};
