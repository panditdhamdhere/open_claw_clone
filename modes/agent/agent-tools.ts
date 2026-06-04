import { tool } from "ai";
import { z } from "zod";
import type { ToolExecutor } from "./tool-executor";

export function createAgentTool(executor: ToolExecutor) {
  return {
    read_file: tool({
      description:
        "Read a text file from workspace, Use a path relative to the project root",
      inputSchema: z.object({
        path: z.string().describe("Relative file path"),
      }),
      execute: async ({ path: p }) => executor.readFile(p),
    }),

    create_file: tool({
      description:
        "Stage creation of new file (not written until user approves",
      inputSchema: z.object({
        path: z.string(),
        content: z.string(),
      }),
      execute: async ({ path: p, content }) => executor.createFile(p, content),
    }),
  };
}
