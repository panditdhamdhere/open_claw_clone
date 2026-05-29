import chalk, { colors } from "chalk";
import { select, isCancel } from "@clack/prompts";

export async function runCliMode() {
  while (true) {
    const mode = await select({
      message: "choose cli sub-mode",
      options: [
        { value: "agent", label: "agent mode" },
        { value: "plan", label: "plan mode" },
        { value: "ask", label: "ask mode" },
        { value: "back", label: "back to main menu" },
      ],
    });

    if (isCancel(mode) || mode == "back") return;

    if (mode === "agent") {
      console.log("agent");
    }
    if (mode === "ask") {
      console.log("ask");
    }

    if (mode === "plan") {
      console.log("plan");
    }

    if (mode !== "agent" && mode !== "plan" && mode !== "ask") {
      console.log(chalk.yellow("\n That mode is not implemmrnted yet."));
    }
  }
}
