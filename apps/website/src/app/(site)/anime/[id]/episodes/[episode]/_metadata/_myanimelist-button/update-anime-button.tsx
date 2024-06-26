import type { MyAnimeListServiceTypes } from "@aniways/data";
import { Button } from "@aniways/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@aniways/ui/dialog";

import { UpdateAnimeForm } from "./update-anime-form";

interface UpdateAnimeButtonProps {
	details: MyAnimeListServiceTypes.AnimeMetadata;
}

export const UpdateAnimeButton = ({ details }: UpdateAnimeButtonProps) => {
	if (!details.mal_id) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Update Anime</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Update Anime - {details.title}</DialogTitle>
				<DialogDescription>
					Update the anime in your MyAnimeList Anime List
				</DialogDescription>
				<UpdateAnimeForm
					malId={details.mal_id}
					listStatus={details.listStatus}
				/>
			</DialogContent>
		</Dialog>
	);
};
