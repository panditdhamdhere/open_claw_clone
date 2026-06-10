# openclaw

A personal AI CLI for working with codebases. **openclaw** runs an LLM agent against your current workspace, stages file and shell changes for review, and can be used from the terminal or Telegram.

Built with [Bun](https://bun.sh), the [Vercel AI SDK](https://sdk.vercel.ai), and [OpenRouter](https://openrouter.ai) for model access.

## Features

- **Agent mode** — Describe a task; the agent reads, searches, and edits your codebase. All writes are staged until you approve them.
- **Ask mode** — Read-only Q&A about the repo, with optional web search. Answers can be saved as Markdown.
- **Plan mode** — Break a goal into steps, pick which to run, then execute them with the full agent toolset.
- **Telegram bot** — Run `/ask`, `/agent`, and `/plan` from chat with inline approval buttons.
- **Human-in-the-loop** — Review diffs and approve or reject changes before anything hits disk.
- **Skills integration** — Discover and read `SKILL.md` files from Cursor and Claude skill directories.

## Prerequisites

- [Bun](https://bun.sh) v1.1+ (recommended)
- An [OpenRouter](https://openrouter.ai) API key
- Optional: [Firecrawl](https://firecrawl.dev) API key (web search in Ask/Plan modes)
- Optional: Telegram bot token and owner chat ID (Telegram mode)

## Installation

```bash
git clone https://github.com/panditdhamdhere/open_claw_clone
cd openclaw
bun install
```

## Configuration

Create a `.env` file in the project root (or export these in your shell):

```bash
# Required
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-sonnet-4   # or any OpenRouter model id

# Optional — web search / crawl (Ask & Plan modes)
FIRECRAWL_API_KEY=fc-...

# Optional — Telegram bot
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_OWNER_ID=your_telegram_user_id

# Optional — extra directories to scan for SKILL.md files (semicolon-separated)
SKILLS_DIRS=/path/to/skills;/other/skills
```

**Workspace root:** By default, the agent operates on `process.cwd()` — run openclaw from the project you want to work in.

## Usage

Start the interactive menu:

```bash
bun run index.ts wakeup
```

Or use the bin alias after linking:

```bash
bun link
openclaw-build wakeup
```

You will see the banner, then choose **CLI** or **Telegram**.

### CLI modes

| Mode   | Purpose |
|--------|---------|
| Agent  | Autonomous coding assistant with staged file/shell mutations |
| Ask    | Read-only questions about the codebase (+ web tools) |
| Plan   | Generate a multi-step plan, select steps, execute with approval |
| Back   | Return to the main menu |

### Agent mode

1. Enter a concrete task (e.g. “Add error handling to the API client”).
2. The agent uses tools to explore and stage changes.
3. Review staged changes — approve all, review one-by-one with diffs, or cancel.
4. Approved changes are written to disk.

### Ask mode

1. Ask a question about the codebase.
2. The agent answers using read-only tools (and web search if configured).
3. Optionally save the Q&A to a `.md` file in the current directory.

### Plan mode

1. Describe a goal.
2. The planner generates structured steps (with optional web research).
3. Select which steps to execute.
4. Each step runs as an agent sub-task; mutations are staged for a single approval at the end.

### Telegram mode

Commands (owner-only):

| Command | Description |
|---------|-------------|
| `/start` | Show welcome message |
| `/ask <question>` | Ask about the codebase |
| `/agent <task>` | Run the coding agent |
| `/plan <goal>` | Generate a plan with toggle buttons, then execute selected steps |

Approval for agent/plan runs is handled via inline **Accept** / **Reject** / **Show diff** buttons in chat.

## Agent tools

| Tool | Agent | Ask | Plan | Description |
|------|:-----:|:---:|:----:|-------------|
| `read_file` | ✓ | ✓ | ✓ | Read a text file (relative path) |
| `list_files` | ✓ | ✓ | ✓ | List directory contents |
| `search_files` | ✓ | ✓ | ✓ | Glob search with optional content filter |
| `analyze_codebase` | ✓ | ✓ | ✓ | File and directory counts |
| `create_file` | ✓ | — | ✓ | Stage new file |
| `modify_file` | ✓ | — | ✓ | Stage full-file replacement |
| `delete_file` | ✓ | — | ✓ | Stage file deletion |
| `create_folder` | ✓ | — | ✓ | Stage directory creation |
| `execute_shell` | ✓ | — | ✓ | Queue shell command (runs after approval) |
| `list_skills` | ✓ | ✓ | ✓ | List `SKILL.md` paths |
| `read_skill` | ✓ | ✓ | ✓ | Read a skill file |
| `web_search` | — | ✓ | ✓ | Search the web (Firecrawl) |
| `web_crawl` | — | ✓ | ✓ | Scrape URL to markdown |
| `fetch_url` | — | ✓ | ✓ | HTTP GET a URL |

Paths outside the workspace root are rejected. Common directories (`node_modules`, `.git`, `dist`, `.env*`, etc.) are excluded from reads and searches.

## Approval workflow

Mutations are never applied immediately:

1. Tool calls stage changes in memory and log them to an `ActionTracker`.
2. You review pending actions in the terminal (or Telegram).
3. For file changes, you can view unified diffs before accepting.
4. Only **approved** actions are applied via `ToolExecutor.applyApprovedFromTracker()`.

Read-only operations (reads, search, analysis, web tools) execute immediately and are logged for visibility.

## Project structure

```
openclaw/
├── index.ts                 # CLI entry (Commander)
├── ai/
│   └── ai.config.ts         # OpenRouter model setup
├── modes/
│   ├── cli.ts               # CLI sub-mode menu
│   ├── agent/               # Agent loop, tools, approval, diff view
│   ├── ask/                 # Read-only Q&A orchestrator
│   ├── plan/                # Planner, step selection, web tools
│   └── telegram/            # Telegraf bot, handlers, sessions
└── tui/
    ├── wakeup.ts            # Banner + main mode picker
    └── terminal-md.ts       # Markdown rendering in the terminal
```

## Tech stack

- **Runtime:** Bun
- **CLI UI:** [@clack/prompts](https://github.com/natemoo-re/clack), [chalk](https://github.com/chalk/chalk), [figlet](https://github.com/patorjk/figlet.js)
- **AI:** [Vercel AI SDK](https://sdk.vercel.ai) (`ToolLoopAgent`), [OpenRouter](https://openrouter.ai)
- **Web:** [@mendable/firecrawl-js](https://github.com/mendableai/firecrawl)
- **Telegram:** [Telegraf](https://telegraf.js.org)
- **Diffs:** [diff](https://github.com/kpdecker/jsdiff)

## Tips

- **Bun + text prompts:** If a `@clack/prompts` `text()` call crashes with `invalid for argument 'format'`, add a `placeholder` option to the prompt. Agent mode already does this; some Ask/Plan prompts may need the same on older Bun versions.
- **Run from your repo:** `cd` into the project you want the agent to modify before starting openclaw.
- **Shell commands:** `execute_shell` runs with `shell: true` only after explicit approval — use with care.
