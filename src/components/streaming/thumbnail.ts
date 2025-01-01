import type Artplayer from "artplayer";

export const thumbnailPlugin = (thumbnails: { file: string }) => {
  return async (art: Artplayer) => {
    const {
      template: { $progress },
    } = art;

    let timer: NodeJS.Timeout | null = null;

    const url = thumbnails?.file;
    if (!url) return;

    const tns = await fetch(url)
      .then((res) => res.text())
      .then((res) =>
        res
          .split("\n")
          .filter((line) => line.trim())
          .slice(1),
      );

    const data: {
      start: number;
      end: number;
      url: string;
      x: number;
      y: number;
      w: number;
      h: number;
    }[] = [];

    tns.forEach((line, index) => {
      if (index % 3 !== 0) return;
      const time = tns[index + 1];
      const url = tns[index + 2];
      if (!time || !url) return;
      const start = time.split(" --> ")[0]!;
      const end = time.split(" --> ")[1]!;

      const startSeconds = start.split(":").reduce((acc, time, i) => {
        return acc + Number(time) * Math.pow(60, 2 - i);
      }, 0);

      const endSeconds = end.split(":").reduce((acc, time, i) => {
        return acc + Number(time) * Math.pow(60, 2 - i);
      }, 0);

      const [x, y, w, h] = url.split("#xywh=")[1]!.split(",").map(Number);

      data.push({
        start: startSeconds,
        end: endSeconds,
        url: `${thumbnails?.file
          .split("/")
          .slice(0, -1)
          .join("/")}/${url.split("#xywh=")[0]}`,
        x: x!,
        y: y!,
        w: w!,
        h: h!,
      });
    });

    art.controls.add({
      name: "vtt-thumbnail",
      position: "top",
      mounted($control) {
        $control.classList.add("art-control-thumbnails");
        art.on("setBar", async (type, percentage, event) => {
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            );

          const isMobileDragging = type === "played" && event && isMobile;

          if (type === "hover" || isMobileDragging) {
            const width = $progress.clientWidth * percentage;
            const second = percentage * art.duration;
            $control.style.display = "flex";

            const find = data.find(
              (item) => item.start <= second && item.end >= second,
            );

            if (!find) {
              $control.style.display = "none";
              return;
            }

            if (width > 0 && width < $progress.clientWidth) {
              $control.style.backgroundImage = `url(${find.url})`;
              $control.style.height = `${find.h}px`;
              $control.style.width = `${find.w}px`;
              $control.style.backgroundPosition = `-${find.x}px -${find.y}px`;
              if (width <= find.w / 2) {
                $control.style.left = "0px";
              } else if (width > $progress.clientWidth - find.w / 2) {
                $control.style.left = `${$progress.clientWidth - find.w}px`;
              } else {
                $control.style.left = `${width - find.w / 2}px`;
              }
            } else {
              if (!isMobile) {
                $control.style.display = "none";
              }
            }

            if (isMobileDragging) {
              if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                $control.style.display = "none";
              }, 1000);
            }
          }
        });
      },
    });
  };
};
