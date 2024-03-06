export const handler = awslambda.streamifyResponse(async (event, responseStream, context) => {

if (event.rawPath) {
  const routeData = [{"regex":"^/(?:/)?$","logGroupPath":"/8a5edab2/"},{"regex":"^/_not\\-found(?:/)?$","logGroupPath":"/788bf135/_not-found"},{"regex":"^/anime\\-list(?:/)?$","logGroupPath":"/7f13d9ab/anime-list"},{"regex":"^/anime/([^/]+?)(?:/)?$","logGroupPath":"/9682b211/anime/id"},{"regex":"^/anime/([^/]+?)/episodes/([^/]+?)(?:/)?$","logGroupPath":"/9e51946f/anime/id/episodes/episode"},{"regex":"^/api/(.+?)(?:/)?$","logGroupPath":"/5a4eb9b6/api/...myanimelist"},{"prefix":"/api/anime/revalidate","logGroupPath":"/7972a907/api/anime/revalidate"},{"prefix":"/api/seed","logGroupPath":"/a62e27f2/api/seed"},{"regex":"^/favicon(?:/)?$","logGroupPath":"/c4cb87c9/favicon"},{"regex":"^/search(?:/)?$","logGroupPath":"/6fb5b778/search"}].find(({ regex, prefix }) => {
    if (regex) return event.rawPath.match(new RegExp(regex));
    if (prefix) return event.rawPath === prefix || (event.rawPath === prefix + "/");
    return false;
  });
  if (routeData) {
    console.log("::sst::" + JSON.stringify({
      action:"log.split",
      properties: {
        logGroupName:"/sst/lambda/" + context.functionName + routeData.logGroupPath,
      },
    }));
  }
}
  const { handler: rawHandler} = await import("./index.mjs");
  return rawHandler(event, responseStream);
});