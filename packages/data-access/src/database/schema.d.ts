export declare const AnimeSeason: import("drizzle-orm/pg-core").PgEnum<["WINTER", "SPRING", "SUMMER", "FALL"]>;
export declare const AnimeType: import("drizzle-orm/pg-core").PgEnum<["TV", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"]>;
export declare const AnimeStatus: import("drizzle-orm/pg-core").PgEnum<["FINISHED_AIRING", "CURRENTLY_AIRING", "NOT_YET_AIRED"]>;
export declare const AnimeAgeRating: import("drizzle-orm/pg-core").PgEnum<["G", "PG", "PG_13", "R", "R_PLUS", "RX"]>;
export declare const anime: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "anime";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "anime";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        description: import("drizzle-orm/pg-core").PgColumn<{
            name: "description";
            tableName: "anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        image: import("drizzle-orm/pg-core").PgColumn<{
            name: "image";
            tableName: "anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        year: import("drizzle-orm/pg-core").PgColumn<{
            name: "year";
            tableName: "anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "anime";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "FINISHED_AIRING" | "CURRENTLY_AIRING" | "NOT_YET_AIRED";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["FINISHED_AIRING", "CURRENTLY_AIRING", "NOT_YET_AIRED"];
            baseColumn: never;
        }, {}, {}>;
        slug: import("drizzle-orm/pg-core").PgColumn<{
            name: "slug";
            tableName: "anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        malAnimeId: import("drizzle-orm/pg-core").PgColumn<{
            name: "mal_anime_id";
            tableName: "anime";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const animeRelations: import("drizzle-orm").Relations<"anime", {
    genres: import("drizzle-orm").Many<"anime_genre">;
    videos: import("drizzle-orm").Many<"video">;
    malAnime: import("drizzle-orm").One<"mal_anime", false>;
}>;
export declare const malAnime: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "mal_anime";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        malId: import("drizzle-orm/pg-core").PgColumn<{
            name: "mal_id";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        year: import("drizzle-orm/pg-core").PgColumn<{
            name: "year";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        season: import("drizzle-orm/pg-core").PgColumn<{
            name: "season";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "WINTER" | "SPRING" | "SUMMER" | "FALL";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["WINTER", "SPRING", "SUMMER", "FALL"];
            baseColumn: never;
        }, {}, {}>;
        type: import("drizzle-orm/pg-core").PgColumn<{
            name: "type";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["TV", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"];
            baseColumn: never;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "FINISHED_AIRING" | "CURRENTLY_AIRING" | "NOT_YET_AIRED";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["FINISHED_AIRING", "CURRENTLY_AIRING", "NOT_YET_AIRED"];
            baseColumn: never;
        }, {}, {}>;
        totalEpisodes: import("drizzle-orm/pg-core").PgColumn<{
            name: "total_episodes";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        duration: import("drizzle-orm/pg-core").PgColumn<{
            name: "duration";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        ageRating: import("drizzle-orm/pg-core").PgColumn<{
            name: "age_rating";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "G" | "PG" | "PG_13" | "R" | "R_PLUS" | "RX";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["G", "PG", "PG_13", "R", "R_PLUS", "RX"];
            baseColumn: never;
        }, {}, {}>;
        malUrl: import("drizzle-orm/pg-core").PgColumn<{
            name: "mal_url";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        titles: import("drizzle-orm/pg-core").PgColumn<{
            name: "titles";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        score: import("drizzle-orm/pg-core").PgColumn<{
            name: "score";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        scoredBy: import("drizzle-orm/pg-core").PgColumn<{
            name: "scored_by";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        airedStart: import("drizzle-orm/pg-core").PgColumn<{
            name: "aired_start";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        airedEnd: import("drizzle-orm/pg-core").PgColumn<{
            name: "aired_end";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        animeId: import("drizzle-orm/pg-core").PgColumn<{
            name: "anime_id";
            tableName: "mal_anime";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const malAnimeRelations: import("drizzle-orm").Relations<"mal_anime", {
    anime: import("drizzle-orm").One<"anime", true>;
}>;
export declare const animeGenre: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "anime_genre";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "anime_genre";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        animeId: import("drizzle-orm/pg-core").PgColumn<{
            name: "anime_id";
            tableName: "anime_genre";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        genre: import("drizzle-orm/pg-core").PgColumn<{
            name: "genre";
            tableName: "anime_genre";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const genreRelations: import("drizzle-orm").Relations<"anime_genre", {
    anime: import("drizzle-orm").One<"anime", true>;
}>;
export declare const video: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "video";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "video";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        animeId: import("drizzle-orm/pg-core").PgColumn<{
            name: "anime_id";
            tableName: "video";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "video";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        url: import("drizzle-orm/pg-core").PgColumn<{
            name: "url";
            tableName: "video";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        episode: import("drizzle-orm/pg-core").PgColumn<{
            name: "episode";
            tableName: "video";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        image: import("drizzle-orm/pg-core").PgColumn<{
            name: "image";
            tableName: "video";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const videoRelations: import("drizzle-orm").Relations<"video", {
    anime: import("drizzle-orm").One<"anime", true>;
}>;
//# sourceMappingURL=schema.d.ts.map