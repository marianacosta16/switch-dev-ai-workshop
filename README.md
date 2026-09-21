# Switch Dev AI Workshop

A web application built with React, Tailwind CSS, shadcn/ui, and Express.

## Tech Stack

- **Frontend:** React 19 + TypeScript, bundled with Vite
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui (base-nova preset)
- **Backend:** Node.js with Express 5
- **Testing:** Vitest (unit tests)
- **Language:** TypeScript throughout

## Project Structure

```
.
├── server/             # Express backend
│   ├── index.ts        # Server entry point with health-check endpoint
│   └── rag/            # Document ingestion for the RAG feature
│       ├── chunk.ts    # Splits page text into overlapping chunks
│       └── ingest.ts   # Reads the PDFs in docs/ and builds the chunks
├── src/                # React frontend
│   ├── components/ui/  # shadcn/ui components
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # React entry point
│   └── index.css       # Tailwind CSS and theme configuration
├── docs/               # Source PDFs for the RAG feature (PDFs are git-ignored)
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

3. **Run the tests:**

   ```bash
   npm test
   ```

   Unit tests run with [Vitest](https://vitest.dev/) and live next to the code they cover (for example `server/rag/chunk.test.ts`). `npm test` runs the suite once; `npx vitest` keeps it running in watch mode while you work.

4. **Build for production:**

   ```bash
   npm run build
   ```

## API Endpoints

| Method | Path          | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/api/health` | Returns server health status |

## RAG Document Ingestion

The app can answer questions about your own PDF documents. The first step is ingestion: reading the PDFs and splitting them into small pieces ("chunks") that can later be embedded and searched.

1. Put your PDFs in `docs/` (see [docs/README.md](docs/README.md) for what to put there).
2. Run:

   ```bash
   npm run ingest
   ```

Each chunk keeps its source file and page number, so answers can cite where the information came from.

### Parameters and why they are set this way

| Parameter | Value | Where | Why |
| --------- | ----- | ----- | --- |
| Chunk size | 500 words | `CHUNK_SIZE_WORDS` in `server/rag/chunk.ts` | Small chunks lose the surrounding context; large chunks mix several topics into one embedding and make search less precise |
| Chunk overlap | 50 words | `CHUNK_OVERLAP_WORDS` in `server/rag/chunk.ts` | Keeps a sentence that crosses a chunk boundary whole in at least one chunk |
| Minimum page size | 20 words | `MIN_PAGE_WORDS` in `server/rag/ingest.ts` | Covers, separators and near-blank pages cannot answer anything and only add noise to the index |

Chunks never span two pages. This keeps the page number in a citation exact, at the cost of splitting an idea that continues on the next page.

### Embeddings

After chunking, `npm run ingest` turns every chunk into a vector — a list of numbers that represents its meaning, so that chunks about the same topic end up close together and can be found by similarity rather than by keyword.

| Setting | Value | Where | Why |
| ------- | ----- | ----- | --- |
| Model | `Xenova/all-MiniLM-L6-v2` | `EMBEDDING_MODEL` in `server/rag/embed.ts` | Small (runs locally, no API key, no document ever leaves the machine) and fast. Mainly English, which matches the documents in `docs/` |
| Dimensions | 384 | `EMBEDDING_DIMENSIONS` | Fixed by the model |
| Batch size | 32 chunks | `BATCH_SIZE` in `server/rag/embed.ts` | Embedding every chunk in one call would hold all intermediate tensors in memory at once |

**The same model must embed both the chunks and the question.** Vectors produced by different models are not comparable, so mixing them would make search return essentially random results. That is why `embed()` is shared rather than duplicated.

Model weights are downloaded from Hugging Face on first run (~87 MB) into `.cache/models/`, which is git-ignored. After that, ingestion works offline. Vectors are normalised, so cosine similarity is a plain dot product.

Note: the model truncates input at roughly 256 word pieces, so the tail of a 500-word chunk is not represented in its vector — worth measuring when tuning chunk size.

These values are starting points, not tuned settings. They are meant to be measured and adjusted once the evaluation is in place.

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
