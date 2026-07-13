const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer");

const rootDir = path.join(__dirname, "..");
const rawPath = path.join(rootDir, "demo_captures", "raw", "baskin_01_home.png");
const outDir = path.join(rootDir, "demo_captures_mockup_candidates");

const variants = [
  {
    id: "v1_balanced",
    label: "V1 balanced",
    phoneW: 326,
    phoneH: 696,
    padding: 7,
    radius: 33,
    screenRadius: 27,
    cameraTop: 18,
    camera: 13,
    volumeTop: 142,
    volumeH: 78,
    powerTop: 244,
    powerH: 58,
    buttonW: 3,
    buttonRight: -4,
    frame: "#283049",
    highlight: "#5c6474"
  },
  {
    id: "v2_reference_slim",
    label: "V2 reference slim",
    phoneW: 326,
    phoneH: 696,
    padding: 6,
    radius: 31,
    screenRadius: 25,
    cameraTop: 17,
    camera: 12,
    volumeTop: 132,
    volumeH: 88,
    powerTop: 238,
    powerH: 62,
    buttonW: 2.5,
    buttonRight: -3,
    frame: "#242b43",
    highlight: "#626b7d"
  },
  {
    id: "v3_higher_buttons",
    label: "V3 higher buttons",
    phoneW: 326,
    phoneH: 696,
    padding: 7,
    radius: 32,
    screenRadius: 26,
    cameraTop: 18,
    camera: 13,
    volumeTop: 118,
    volumeH: 92,
    powerTop: 230,
    powerH: 64,
    buttonW: 3,
    buttonRight: -4,
    frame: "#293048",
    highlight: "#687185"
  },
  {
    id: "v4_tight_frame",
    label: "V4 tight frame",
    phoneW: 318,
    phoneH: 690,
    padding: 6,
    radius: 30,
    screenRadius: 24,
    cameraTop: 17,
    camera: 12,
    volumeTop: 126,
    volumeH: 86,
    powerTop: 232,
    powerH: 60,
    buttonW: 2.5,
    buttonRight: -3,
    frame: "#252c42",
    highlight: "#596274"
  },
  {
    id: "v5_button_forward",
    label: "V5 button forward",
    phoneW: 326,
    phoneH: 696,
    padding: 7,
    radius: 33,
    screenRadius: 27,
    cameraTop: 18,
    camera: 13,
    volumeTop: 126,
    volumeH: 96,
    powerTop: 236,
    powerH: 68,
    buttonW: 4,
    buttonRight: -5,
    frame: "#283049",
    highlight: "#70798d"
  },
  {
    id: "v4_edit",
    label: "V4 edit",
    phoneW: 318,
    phoneH: 690,
    padding: 6,
    radius: 30,
    screenRadius: 24,
    cameraTop: 17,
    camera: 12,
    volumeTop: 122,
    volumeH: 88,
    powerTop: 228,
    powerH: 62,
    buttonW: 3,
    buttonRight: -1,
    frame: "#252c42",
    highlight: "#596274"
  }
];

function cssFor(v) {
  return `
    html, body {
      width: 380px;
      height: 750px;
      margin: 0;
      background: transparent;
    }
    body {
      display: grid;
      place-items: center;
    }
    .mockup {
      width: 380px;
      height: 750px;
      display: grid;
      place-items: center;
      background: transparent;
    }
    .phone {
      position: relative;
      width: ${v.phoneW}px;
      height: ${v.phoneH}px;
      padding: ${v.padding}px;
      border-radius: ${v.radius}px;
      background: linear-gradient(90deg, ${v.frame} 0%, #0a0b10 7%, #020203 15%, #020203 85%, #11141e 94%, ${v.highlight} 100%);
      box-shadow: none;
    }
    .phone::before {
      content: "";
      position: absolute;
      inset: 2px;
      border: 1px solid rgba(93, 101, 132, 0.86);
      border-radius: ${v.radius - 2}px;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16), inset 0 0 0 3px rgba(0, 0, 0, 0.84);
      pointer-events: none;
    }
    .phone::after {
      content: "";
      position: absolute;
      left: 50%;
      top: ${v.cameraTop}px;
      z-index: 4;
      width: ${v.camera}px;
      height: ${v.camera}px;
      border: 2px solid #0a0a0b;
      border-radius: 50%;
      background: radial-gradient(circle at 55% 42%, #263f7f 0 14%, #05070d 15% 48%, #111 49% 100%);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.18), inset 1px 1px 2px rgba(111, 143, 255, 0.5);
      transform: translateX(-50%);
    }
    .screen {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: ${v.screenRadius}px;
      background: #f7f7f8;
      box-shadow: 0 0 0 3px #050506, inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .speaker {
      position: absolute;
      left: 50%;
      top: 4px;
      z-index: 5;
      width: 42px;
      height: 2px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.34);
      transform: translateX(-50%);
    }
    .antenna {
      position: absolute;
      z-index: 3;
      height: 1px;
      border-radius: 999px;
      background: rgba(210, 214, 221, 0.34);
    }
    .antenna.top-left { left: 80px; top: 2px; width: 18px; }
    .antenna.top-center { left: 50%; top: 2px; width: 20px; transform: translateX(-50%); }
    .antenna.bottom-left { left: 80px; bottom: 2px; width: 19px; }
    .antenna.bottom-center { left: 50%; bottom: 2px; width: 23px; transform: translateX(-50%); }
    .side-button {
      position: absolute;
      right: ${v.buttonRight}px;
      z-index: 6;
      width: ${v.buttonW}px;
      border-radius: 0 999px 999px 0;
      background: linear-gradient(90deg, #303646, #8992a4 60%, #3f4658);
    }
    .side-button.volume {
      top: ${v.volumeTop}px;
      height: ${v.volumeH}px;
    }
    .side-button.power {
      top: ${v.powerTop}px;
      height: ${v.powerH}px;
    }
    .label {
      position: absolute;
      left: 50%;
      bottom: -22px;
      color: rgba(17, 24, 39, 0.72);
      font: 700 12px Arial, sans-serif;
      transform: translateX(-50%);
      white-space: nowrap;
    }
  `;
}

async function renderVariant(browser, src, v) {
  const page = await browser.newPage();
  await page.setViewport({ width: 380, height: 750, deviceScaleFactor: 2 });
  await page.setContent(`
    <!doctype html>
    <html>
      <head><style>${cssFor(v)}</style></head>
      <body>
        <div class="mockup" id="mockup">
          <div class="phone">
            <i class="antenna top-left"></i>
            <i class="antenna top-center"></i>
            <i class="antenna bottom-left"></i>
            <i class="antenna bottom-center"></i>
            <i class="side-button volume"></i>
            <i class="side-button power"></i>
            <div class="screen"><img src="${src}" alt=""></div>
            <i class="speaker"></i>
            <span class="label">${v.label}</span>
          </div>
        </div>
      </body>
    </html>
  `, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const image = document.querySelector("img");
    return image?.complete && image.naturalWidth > 0;
  });
  const element = await page.$("#mockup");
  const outPath = path.join(outDir, `${v.id}.png`);
  await element.screenshot({ path: outPath, omitBackground: true });
  await page.close();
  return outPath;
}

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const src = `data:image/png;base64,${fs.readFileSync(rawPath).toString("base64")}`;
  const browser = await puppeteer.launch({ headless: true });
  try {
    const outputs = [];
    for (const variant of variants) {
      outputs.push(await renderVariant(browser, src, variant));
    }
    fs.writeFileSync(path.join(outDir, "README.md"), `# Mockup Candidates

한 장짜리 후보입니다. 고른 버전 id를 알려주면 그 기준으로 전체 54장을 생성합니다.

${outputs.map((file) => `- ${path.basename(file)}`).join("\n")}
`);
    console.log(outputs.join("\n"));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
