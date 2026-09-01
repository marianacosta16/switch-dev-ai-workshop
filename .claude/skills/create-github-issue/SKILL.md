---
name: create-github-issue
description: >
  Create a well-structured GitHub issue using the project's feature request template.
  Use this skill whenever the user wants to create a GitHub issue, file a bug, request a feature,
  track a task, or says things like "open an issue", "create a ticket", "file an issue",
  "I need an issue for...", or "let's track this". Also trigger when the user describes
  a problem or feature and you think it should be tracked — suggest creating an issue.
---

# Create GitHub issue

Create GitHub issues for the `mffcosta16/switch-dev-ai-workshop` repository using a structured
feature request template that matches the project's existing issue style.

## Workflow

### 1. Gather context

Before writing the issue, collect what you need:

- **From the user**: what they want to build, fix, or change — and why it matters
- **From the codebase**: run `git log --oneline -20` and scan recent files to understand
  what areas of the code are relevant. Note the tech stack (React, Tailwind, shadcn/ui,
  Express) so the issue body reflects accurate technical context.
- **From GitHub**: search existing issues to check for duplicates (see step 2)

### 2. Check for duplicates

Before creating, search for similar existing issues:

```
Use mcp__github__search_issues with:
  owner: mffcosta16
  repo: switch-dev-ai-workshop
  query: <keywords from the user's request>
```

If the MCP tool is unavailable, fall back to the `gh` CLI:

```bash
gh search issues --repo mffcosta16/switch-dev-ai-workshop "<keywords>"
```

If potential duplicates are found, show them to the user with their title, number, and state.
Let the user decide whether to proceed. Don't block — just inform.

### 3. Draft the issue

Use this template — it matches the style established in issues #6 and #10:

```markdown
## Summary
<One clear sentence describing what to build or change.>

## Context
<Why this matters. What it enables. Include relevant technical details
pulled from the codebase — which files, components, or APIs are involved.
Mention what's currently in place and what's missing.>

<If applicable, note what's out of scope to keep the issue focused.>

## Acceptance criteria
- [ ] <Specific, testable condition>
- [ ] <Another condition>
- [ ] <Keep each item concrete and verifiable>
```

Guidelines for good issues:
- The **summary** should be a single sentence someone can understand without reading the rest
- The **context** section does the heavy lifting — explain the current state, the desired state,
  and the gap between them. Pull specifics from the codebase (file paths, component names,
  API endpoints) so the implementer has a head start
- **Acceptance criteria** should be checkboxes, each one a binary pass/fail condition.
  Aim for 3–7 items. Avoid vague criteria like "works well" — prefer "authenticated users
  navigating to /login are redirected to the app"

### 4. Confirm with the user

Show the drafted issue (title + body) and ask for confirmation before creating it.
The user might want to tweak wording, add criteria, or adjust scope.

### 5. Create the issue

Try the MCP tool first:

```
Use mcp__github__issue_write with:
  method: create
  owner: mffcosta16
  repo: switch-dev-ai-workshop
  title: <the issue title>
  body: <the formatted body>
  labels: ["enhancement"]
```

If the MCP tool fails (e.g., token permissions), fall back to the `gh` CLI:

```bash
gh issue create \
  --repo mffcosta16/switch-dev-ai-workshop \
  --title "<title>" \
  --label "enhancement" \
  --body "<body>"
```

After creation, share the issue URL with the user.

## Label guidance

Default label is `enhancement`. If the user's request clearly describes a bug
(something that used to work and now doesn't, or behavior that contradicts the
acceptance criteria of a previous issue), use `bug` instead.

## Title conventions

- Start with a verb: "Add...", "Fix...", "Update...", "Remove..."
- Keep it under 70 characters
- Be specific: "Add login page with credential-gated access" not "Authentication"
