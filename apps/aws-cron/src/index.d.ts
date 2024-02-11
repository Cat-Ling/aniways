declare const _default: {
    cron: {
        handler: string;
        events: ({
            schedule: string;
            http?: undefined;
        } | {
            http: {
                method: string;
                path: string;
            };
            schedule?: undefined;
        })[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map