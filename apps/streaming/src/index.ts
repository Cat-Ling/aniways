import express from "express";

const app = express();

app.get("/streaming/:url", async (req, res) => {
  const url = req.params.url;

  const base = url.split("/").slice(0, -1).join("/");

  if (!url) {
    res.status(400).send("Missing url");
    return;
  }

  if (url.includes(".ts")) {
    const response = await fetch(url);
    const blob = await response.blob();

    res.type(blob.type);
    const buffer = await blob.arrayBuffer();
    res.send(Buffer.from(buffer));

    return;
  }

  const response = await fetch(url)
    .then(response => response.text())
    .then(content => {
      return content
        .split("\n")
        .map(line => {
          if (!line.includes(".m3u8") && !line.includes(".ts")) return line;
          return `${req.protocol}://${req.get("host")}/streaming/${encodeURIComponent(
            base + "/" + line
          )}`;
        })
        .join("\n");
    });

  res.send(response);
});

app.listen(4545, () => {
  console.log("Server is running on http://localhost:4545");
});
