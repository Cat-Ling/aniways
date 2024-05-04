import { APIGatewayProxyHandler } from 'aws-lambda';
import { healthCheck } from './check-service';

export const home: APIGatewayProxyHandler = async () => {
  const baseUrl =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.IS_OFFLINE ?
      'http://localhost:8081/dev'
    : 'https://healthcheck.aniways.xyz';

  const response = await healthCheck(null as any, null as any, null as any);

  const html = `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="icon" href="https://aniways.xyz/favicon" />
        <title>Health Check | Aniways</title>
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            min-height: 0;
            min-width: 0;
            font-size: 100%;
          }

          body {
            font-family: Arial, sans-serif;
            background-color: hsl(20 14.3% 4.1%);
            color: hsl(0 0% 95%);
          }

          nav {
            border-bottom: 1px solid hsl(240 3.7% 15.9%);
            width: 100%;
          }

          nav div {
            padding-left: .75rem;
            padding-right: .75rem;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
            max-width: 1400px;
          }

          nav a image {
            margin-left: -.75rem;
            height: 5rem;
            width: 5rem;
          }

          nav a {
            display: flex;
            align-items: center;
            color: hsl(0 0% 95%);
            text-decoration: none;
            font-size: 1.5rem;
            line-height: 2rem;
            font-weight: bold;
            cursor: pointer;
          }

          section {
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
            padding: 1rem;
          }

          h1 {
            font-size: 200%;
            font-weight: bold;
          }

          p {
            color: hsl(240 5% 64.9%);
            margin-bottom: 2rem;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            padding: .5rem;
            border: 1px solid hsl(240 3.7% 15.9%);
          }
          
          th {
            text-align: left;
            font-weight: bold;
            background-color: hsl(240 3.7% 15.9%);
          }

          td#myanimelist, td#episode, td#website {
            width: 50%;
          }
        </style>
      </head>
      <body>
        <nav>
          <div>
            <a href="https://aniways.xyz">
              <img src="https://aniways.xyz/logo.png" alt="Aniways" width="80" height="80" />
              AniWays
            </a> 
          </div>
        </nav>
        <section>
          <h1>Welcome to the health check service</h1>
          <p>
            This service is used to check if the services are up and running.
          </p>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>Website</td>
              <td id="website">
                Loading...
              </td>
            </tr>
              <tr>
                <td>MyAnimeList Service</td>
                <td id="myanimelist">
                  Loading...
                </td>
              </tr>
              <tr>
                <td>Episode Service</td>
                <td id="episode">
                  Loading...
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <script>
          let lastFetched = new Date(${new Date().getTime()});
          let basedata = JSON.parse(${JSON.stringify(response!.body)});

          const updateUI = (response) => {
            document.getElementById('website').innerHTML = response.dependencies.website ? '✅' : '❌';
            document.getElementById('myanimelist').innerHTML = response.dependencies.myAnimeList ? '✅' : '❌';
            document.getElementById('episode').innerHTML = response.dependencies.episodeService ? '✅' : '❌';
            lastFetched = new Date();
          }

          const fetchData = () => {
            if (lastFetched && new Date() - lastFetched < 180000) return updateUI(basedata);

            fetch('${baseUrl}/healthcheck')
              .then(res => res.json())
              .then(updateUI)
          }

          fetchData();

          window.addEventListener('focus', () => {
            const now = new Date();

            // Fetch data every 3 minutes
            if (!lastFetched || now - lastFetched > 180000) {
              fetchData();
            }
          });
        </script>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html',
      // enable cache for 3 minutes
      'cache-control': 'public, max-age=180',
    },
    body: html,
  };
};
