# Switch Dev AI Workshop

A web application built with React, Tailwind CSS, shadcn/ui, and Express.

## Tech Stack

- **Frontend:** React 19 + TypeScript, bundled with Vite
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui (base-nova preset)
- **Backend:** Node.js with Express 5
- **Language:** TypeScript throughout

## Project Structure

```
.
├── server/             # Express backend
│   └── index.ts        # Server entry point with health-check endpoint
├── src/                # React frontend
│   ├── components/ui/  # shadcn/ui components
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # React entry point
│   └── index.css       # Tailwind CSS and theme configuration
├── public/             # Static assets
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration (includes API proxy)
├── tsconfig.json       # TypeScript root config
├── tsconfig.app.json   # TypeScript config for the frontend
├── tsconfig.server.json# TypeScript config for the backend
└── components.json     # shadcn/ui configuration
```

## Prerequisites

- Node.js 20 or later
- npm 10 or later

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development servers:**

   ```bash
   npm run dev
   ```

   This starts both the Vite dev server (frontend on `http://localhost:5173`) and the Express server (backend on `http://localhost:3001`) concurrently.

   You can also start them individually:

   ```bash
   npm run dev:frontend   # Vite dev server only
   npm run dev:backend    # Express server only
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

## API Endpoints

| Method | Path          | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/api/health` | Returns server health status |

## Setting Up the GitHub CLI (`gh`)

Claude Code uses the [GitHub CLI](https://cli.github.com/) (`gh`) under the hood for many GitHub operations — creating PRs, viewing issues, managing releases, etc. Install it and authenticate before using Claude Code with GitHub.

### Installation

**macOS (Homebrew):**

```bash
brew install gh
```

**Windows (winget):**

```bash
winget install --id GitHub.cli
```

**Linux (apt):**

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

For other platforms, see the [official installation docs](https://github.com/cli/cli#installation).

### Authentication

After installing, log in to your GitHub account:

```bash
gh auth login
```

Follow the interactive prompts to authenticate via browser or token. Once complete, verify with:

```bash
gh auth status
```

## Setting Up the GitHub MCP Server

The [GitHub MCP Server](https://github.com/github/github-mcp-server) gives Claude Code direct access to GitHub — creating issues, opening PRs, searching repositories, and more — all from within your coding session.

### Prerequisites

- Claude Code CLI installed
- A [GitHub Personal Access Token (PAT)](https://github.com/settings/personal-access-tokens/new) with `repo` scope

### Installation

Run this command in your terminal, replacing `YOUR_GITHUB_PAT` with your actual token:

```bash
claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer YOUR_GITHUB_PAT"}}'
```

**Tip:** To avoid hardcoding your token, store it in a `.env` file and reference it via an environment variable:

```bash
# Add to .env (make sure .env is in .gitignore)
GITHUB_PAT=your_token_here

# Then run:
export GITHUB_PAT="$(grep '^GITHUB_PAT=' .env | cut -d '=' -f2-)"
claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer '"$GITHUB_PAT"'"}}'
```

### Verification

After setup, restart Claude Code and verify the server is connected:

```bash
claude mcp list
```

You should see `github` listed as a configured MCP server.

### Troubleshooting

- Verify your PAT has `repo` scope and hasn't expired
- Check configuration with `claude mcp list`
- If problems persist, remove and reconfigure: `claude mcp remove github`

For the full installation guide, see the [official docs](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md).

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

See the [shadcn/ui docs](https://ui.shadcn.com/docs/components) for available components.
