import { client } from "@aniways/db";

import { createLogger } from "../utils/logger";
import { checkIfOffline } from "../utils/offline";
import { insertAnimesToDb } from "./db";
import { scrape } from "./scrape";

const logger = createLogger("AniwaysSyncAnimeCron", "cron");

export const handler = async () => {
	try {
		if (checkIfOffline()) throw new Error("Offline mode");

		const newAnimes = await scrape();

		if (newAnimes.length === 0) {
			return logger.log("No new anime episodes to insert");
		}

		const animesInserted = await insertAnimesToDb(newAnimes);

		logger.log("Inserted", animesInserted, "new anime episodes into db");
	} catch (error) {
		logger.error(error);
	} finally {
		await client.end(); // Close the connection

		logger.log("End of cron job");
	}
};
