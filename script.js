browser.storage.local.get("apiKey", ({ apiKey }) => {
  (function () {
    const YT_API_KEY = apiKey;
    const BASE_ENDPOINT = "https://www.googleapis.com/youtube/v3";

    const video_id = new URLSearchParams(window.location.search).get("v");
    async function fetch_from_repl(vid) {
      fetch(
        `https://yt-dislikes-viewer-api.websitedesigne1.repl.co/data/get?video_id=${vid}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data || !data[0]) return 010101;
          if (data[0] == "nope") return false;
          console.log(data);
          return parseInt(data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    async function put_on_repl(vid, count) {
      const url = `https://yt-dislikes-viewer-api.websitedesigne1.repl.co/data/put?video_id=${vid}&dislike_count=${count}`;
      fetch(url)
        .then((response) => response.json())
        .then((json) => console.log(json));
      console.log(await response.json());
    }
    async function run() {
      if (
        !(await fetch_from_repl(video_id)) ||
        (await fetch_from_repl(video_id)) == 010101
      ) {
        const info = await fetchInfo(video_id)
          const percentage_like = likePercentage(
            parseInt(info.likes),
            parseInt(info.dislikes)
          );
          addBar(info.likes, info.dislikes,percentage_like);

          editDislikes(info.dislikes);
          await put_on_repl(video_id, parseInt(info.dislikes));
        console
          .log("Putting on Archive API")
          .catch((err) => console.error(err));
      } else {
        const info = await fetchInfo(video_id)
        const percentage_like = likePercentage(parseInt(info.likes), parseInt(info.dislikes));
        addBar(info.likes, info.dislikes, percentage_like);
        const disss = await fetch_from_repl(video_id);
        console.log(disss + " " + " disss ");
        editDislikes(disss);
        console.log("Fetched from the archive API");
      }
    }
    function numberToAbbreviatedString(number) {
      let result = "";
      let num = number;
      let unit = "";
      let numStr = num.toString();
      if (numStr.length > 3) {
        num = num / 1000;
        unit = "K";
      }
      if (numStr.length > 6) {
        num = num / 1000;
        unit = "M";
      }
      if (numStr.length > 9) {
        num = num / 1000;
        unit = "B";
      }
      result =
        numStr.length <= 3 && unit === ""
          ? num.toFixed(0) + unit
          : num.toFixed(1) + unit;
      return result;
    }
    async function fetchInfo(videoId) {
      if (!videoId) {
        videoId = new URLSearchParams(window.location.search).get("v");
      }
      const endpoint = `${BASE_ENDPOINT}/videos?key=${YT_API_KEY}&id=${videoId}&part=statistics`;

      return fetch(endpoint)
        .then((r) => r.json())
        .then(
          (r) =>
            (values = {
              dislikes: parseInt(r.items[0].statistics.dislikeCount),
              likes: parseInt(r.items[0].statistics.likeCount),
            })
        );
    }
    function editDislikes(dislikeNo) {
      let selector;
      // Fetch the dislike label
      const selectorOldUi =
        "ytd-menu-renderer.ytd-video-primary-info-renderer > div > :nth-child(2) yt-formatted-string";
      const selectorNewUi =
        "ytd-menu-renderer.ytd-watch-metadata > div > :nth-child(2) yt-formatted-string";

      const checkForNewUI = document.getElementById("description-and-actions");
      if (checkForNewUI) {
        selector = selectorNewUi;
      } else {
        selector = selectorOldUi;
      }

      const dislikeLabel = document.querySelector(selector);

      // Update the label with the new dislike count
      const formattedDislikes = numberToAbbreviatedString(dislikeNo);
      dislikeLabel.textContent = formattedDislikes;
    }

    // ################# Crashes the extension in FF #################
    // function getLikes() {
    //   const count = document
    //     .querySelector(
    //       "ytd-menu-renderer.ytd-video-primary-info-renderer > div > :nth-child(1) yt-formatted-string"
    //     )
    //     .ariaLabel.replace(/[^\d-]/g, "");
    //   return parseInt(count);
    // }

    function likePercentage(likeCount, dislikeCount) {
      return (100 * likeCount) / (likeCount + dislikeCount);
    }

    function addBar(likes, dislikes, likePercentage) {
      // checks for new UI of youtube or Old
      const selectorOldUi = document.getElementById("menu-container");
      const selectorNewUi = document.getElementById("actions-inner");

      if (selectorOldUi || selectorNewUi) {
        let selector;
        if (selectorNewUi) {
          selector = selectorNewUi;
        } else {
          selector = selectorOldUi;
        }
        const prgroess = document.getElementById("custom-progress");

        let clipButton = document.querySelector('[aria-label="Clip"]');
        let ThanksButton = document.querySelector('[aria-label="Thanks"]');

        if (prgroess) {
          return;
        }
        const progress = document.createElement("div");
        const tooltip = document.createElement("div");
        const color = document.createElement("div");

        // Fix for Dark youtube Mode and Light youtube mode

        let colorBackground;
        let progressBackround;

        let darkMode = document
          .getElementsByTagName("html")[0]
          .getAttribute("dark");
        if (darkMode) {
          progressBackround = "grey";
          colorBackground = "white";
        } else {
          colorBackground = "black";
          progressBackround = "grey";
        }

        progress.className = "progress";
        progress.style.position = "relative";
        progress.style.height = "3px";
        progress.style.width = "40%";
        progress.style.background = `${progressBackround}`;
        progress.style.marginright = "20px";
        progress.setAttribute("id", "custom-progress");
        progress.style.marginTop = "3px";
        color.className = "color";
        color.style.position = "absolute";
        color.style.background = `${colorBackground}`;
        color.style.width = `${likePercentage}%`;
        color.style.height = "3px";
        color.setAttribute("id", "color");

        progress.addEventListener("mouseover", async () => {
          let videoId = new URLSearchParams(window.location.search).get("v");
          let info = await fetchInfo(videoId);

          tooltip.innerHTML = `
          <!--<tp-yt-paper-tooltip position="top" class="" role="tooltip" tabindex="-1" style="left: 25.6833px; bottom: -64px;"><!--css-build:shady-->
          <div id="tooltip" class="style-scope tp-yt-paper-tooltip visible" style="background:#616161; max-width:110px; Position:Absolute; Z-Index: 4">
          ${likes} / ${dislikes}
        </tp-yt-paper-tooltip>
          `;

          selector.appendChild(tooltip);
        });
        progress.addEventListener("mouseout", () => {
          tooltip.parentNode.removeChild(tooltip);
        });

        if (clipButton) {
          progress.style.width = "32.5%";
        } else if (ThanksButton) {
          progress.style.width = "30.5%";
        }

        if (clipButton && ThanksButton) {
          progress.style.width = "25.5%";
        }

        progress.appendChild(color);

        selector.appendChild(progress);
      }
    }


    run();
  })();
});
