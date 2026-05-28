#!/usr/bin/env bun

import { Command } from "commander";

const program = new Command();

program
  .name("openclaw-build")
  .description("This is Pandit's Personal cli")
  .version("0.0.1");

program
  .command("wakeup")
  .description("show the banner and pick cli or Telegram mode")
  .action(async () => {
    console.log("wake up calling...");
  });

await program.parseAsync(process.argv);
