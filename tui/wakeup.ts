import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";

import figlet from "figlet";
import { runCliMode } from "../modes/cli";
import { runTelegramMode } from "../modes/telegram";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("#5f5f67");
const FACE = chalk.hex("#e8dcf8").bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");
  // const maxLen = Math.max(...bannerLines.map((1) => 1.length), 0)
  const maxLen = Math.max(...bannerLines.map((l: string) => l.length));
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW((" " + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A]`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}

export async function runWakeup() {
  let ascii: string;

  try {
    ascii = figlet.textSync("openclaw", { font: BANNER_FONT });
  } catch (error) {
    ascii = figlet.textSync("openclaw", { font: "Standard" });
  }

  printBannerWithShadow(ascii);

  const mode = await select({
    message: "Which mode you want to proceed with ?",
    options: [
      { value: "cli", label: "CLI" },
      { value: "Telegram", label: "TELEGRAM" },
      { value: "exit", label: "EXIT" },
    ],
  });

  if (isCancel(mode || mode === "exit")) {
    // process.exit(0);
    console.log(chalk.dim("\n Goodbye! \n"));
    return;
  }

  if (mode === "cli") {
    await runCliMode();
  } else if (mode === "Telegram") {
    // console.log(chalk.dim("starting Telegram mode..."));
    await runTelegramMode()
  }
}
