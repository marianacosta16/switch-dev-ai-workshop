---
name: create-pull-request
description: >
  Create a GitHub pull request with a structured title that includes the issue number.
  Use this skill whenever the user wants to create a PR, open a pull request,
  submit changes for review, or says things like "create a PR", "open a pull request",
  "submit this for review", "PR for issue #X", or "let's get this merged".
  Also trigger when the user has finished implementing an issue and needs to
  open a PR — even if they don't explicitly say "pull request".
---

# Create Pull Request

Create GitHub pull requests for the `mffcosta16/switch-dev-ai-workshop` repository
with a standardized title format that references the related issue number.

## Workflow

### 1. Gather context

Before creating the PR, collect what you need:

- **Current branch**: run `git branch --show-current` to confirm you're not on `main`
- **Related issue**: confirm whether this PR has a related issue (see the
  "Confirm a related issue" step below before drafting).
- **Changes**: run `git log main..HEAD --oneline` and `git diff main...HEAD --stat`
  to understand what changed

If the user is still on `main`, help them create a feature branch first using the
convention `feat/<issue-number>-<short-slug>` (e.g., `feat/6-bootstrap-web-app`).

#### Confirm a related issue

Every PR should reference an issue — the title format and `Closes #N` link both
depend on it. Before drafting, establish the issue number:

1. **Check for an obvious link first.** Look at the branch name (e.g.
   `feat/6-...` implies issue #6) and this session's history — if the
   `create-github-issue` skill was already run, use the issue it created. Confirm
   the number with the user rather than assuming.
2. **If no issue is known, ask the user:** "Which issue does this PR address?"
3. **If the user says there is no issue,** offer to create one first by invoking
   the `create-github-issue` skill, so the PR can link to it. Only proceed
   without an issue if the user explicitly declines — in that case use a plain
   descriptive title (no `#N` prefix) and omit `Closes #N` from the body.

Once you have the issue number, look it up (`gh issue view <number>`) to pull
context for the PR description.

### 2. Check branch is pushed

Make sure all commits are pushed to the remote:

```bash
git status
git push -u origin <branch-name>
```

Always confirm with the user before pushing.

### 3. Draft the PR

#### Title format

```
#<issue-number> - <short description>
```

Rules:
- Always start with `#` followed by the issue number
- Follow with ` - ` (space-dash-space) as separator
- Keep the description under 60 characters
- Use lowercase, imperative mood: "add", "fix", "update", "remove"

Examples:
- `#6 - bootstrap React + Tailwind + shadcn/ui + Express app`
- `#12 - fix authentication redirect loop`
- `#3 - add presenter notes export to PDF`

#### PR body template

The repository has a canonical PR template at `.github/pull_request_template.md`.
Use it as the source of truth for the description so PRs created via `gh` match
the ones GitHub auto-fills in the web UI. Fill in each section and check the
boxes that apply:

```markdown
## Summary
<1-3 bullet points describing what this PR does and why>

Closes #<issue-number>

## Type of change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would change existing behavior)
- [ ] Refactor (no functional change)
- [ ] Documentation
- [ ] Chore / tooling

## Changes description
<Bulleted list of the key changes, grouped by area if needed>

## How has this been tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Tests added or updated where necessary
- [ ] Documentation updated (if needed)
```

Guidelines:
- Keep this in sync with `.github/pull_request_template.md`. If that file changes,
  prefer reading it (`cat .github/pull_request_template.md`) and using its current
  contents over the copy above.
- The **summary** should give a reviewer enough context to understand the PR
  without reading every line of code. Link the issue with `Closes #N` so it
  auto-closes when merged.
- Under **Type of change**, check exactly the boxes that apply (usually one).
- The **changes description** highlights what's important — don't list every file,
  focus on the meaningful decisions (new dependencies, architectural choices,
  API changes).
- Under **How has this been tested?**, check the testing you actually did and,
  where useful, add a short note on the concrete steps a reviewer can follow.
- Work through the **Checklist** honestly before requesting review.

### 4. Confirm with the user

Show the drafted PR (title + body) and ask for confirmation before creating it.
The user might want to adjust scope, add context, or change the test plan.

### 5. Create the PR

```bash
gh pr create \
  --title "<title>" \
  --body "<body>" \
  --base main
```

After creation, share the PR URL with the user.

### 6. Review the PR

Once the PR is created, invoke the `review-pull-request` skill to run a review
on the newly opened PR. This gives the user an immediate sanity check — catching
issues before a human reviewer sees them.

## Branch naming convention

When a branch needs to be created, use this format:

```
<type>/<issue-number>-<short-slug>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`

Examples:
- `feat/6-bootstrap-web-app`
- `fix/12-auth-redirect`
- `chore/15-update-deps`

## Label guidance

If the repository has labels configured, apply them based on the change type:
- `enhancement` for new features
- `bug` for fixes
- `documentation` for docs-only changes
