"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { auth } from "@aniways/auth";
import { createMyAnimeListService } from "@aniways/data";

export const addToListAction = async (malId: number, pathname: string) => {
	try {
		const user = await auth(cookies());

		if (!user) {
			throw new Error("Must be logged in to add to list");
		}

		const { addAnimeToMyList, getAnimeMetadataFromMyAnimeList } =
			createMyAnimeListService();

		await addAnimeToMyList(user.accessToken, malId);

		revalidatePath(pathname, "layout");

		const details = await getAnimeMetadataFromMyAnimeList(user.accessToken, {
			malId,
		});

		return { details };
	} catch (e) {
		console.error(e);

		const error = e instanceof Error ? e : new Error("Failed to add to list");

		return {
			error: error.message,
		};
	}
};

export const deleteAnimeInListAction = async (
	malId: number,
	pathname: string,
) => {
	try {
		const user = await auth(cookies());

		if (!user) {
			throw new Error("Must be logged in to delete from list");
		}

		const { deleteAnimeFromMyList } = createMyAnimeListService();

		await deleteAnimeFromMyList(user.accessToken, malId);

		revalidatePath(pathname, "layout");

		return { success: true };
	} catch (e) {
		console.error(e);

		const error =
			e instanceof Error ? e : new Error("Failed to delete from list");

		return {
			error: error.message,
		};
	}
};

export const updateAnimeInListAction = async (
	malId: number,
	status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch",
	episodesWatched: number,
	score: number,
	pathname: string,
) => {
	try {
		const user = await auth(cookies());

		if (!user) {
			throw new Error("Must be logged in to update list");
		}

		const { updateAnimeInMyList } = createMyAnimeListService();

		await updateAnimeInMyList(
			user.accessToken,
			malId,
			status,
			episodesWatched,
			score,
		);

		revalidatePath(pathname, "layout");

		return { success: true };
	} catch (e) {
		console.error(e);

		const error = e instanceof Error ? e : new Error("Failed to update list");

		return {
			error: error.message,
		};
	}
};
