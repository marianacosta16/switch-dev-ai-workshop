---
name: review-pull-request
description: >
  Review a GitHub pull request — read the diff, check it against the linked issue,
  and produce a structured review with findings and a verdict.
  Use this skill whenever the user wants to review a PR, check a PR's changes,
  or says things like "review PR #X", "check this PR", "what do you think of this PR",
  "look at this pull request", "review the open PRs", or "can you review my changes".
  Also trigger after a PR has just been created and the user wants a quick sanity check
  before requesting human review.
---

# Review Pull Request

Review GitHub pull requests for the `mffcosta16/switch-dev-ai-workshop` repository.
The goal is to give the user a clear, actionable summary so they can approve,
request changes, or discuss with confidence.

## Workflow

### 1. Identify the PR

If the user provided a PR number or URL, use it directly.

Otherwise, list open PRs and ask which one to review:
```bash
gh pr list --state open --json number,title,author,createdAt
```

### 2. Fetch PR details

```bash
gh pr view <number> --json title,body,state,author,baseRefName,headRefName,additions,deletions,changedFiles,reviewDecision,labels,assignees
```

### 3. Read the diff

```bash
gh pr diff <number>
```

For large PRs (more than 500 lines of diff), break the review into sections
by listing files first, then reviewing each one individually:
```bash
gh pr diff <number> --name-only
```

### 4. Check the linked issue

Extract the issue number from the PR title (the `#N` prefix) or from `Closes #N`
in the body. Pull up the issue to compare what was requested against what was
implemented — this comparison is the backbone of the review.

```bash
gh issue view <number> --json title,body
```

### 5. Produce the review

Structure the review using this template:

```markdown
## PR Review: #<pr-number> — <pr-title>

### Overview
<1-2 sentences: what this PR does and whether it addresses the linked issue>

### Issue alignment
- **Issue**: #<issue-number> — <issue-title>
- **Status**: <Fully addressed / Partially addressed / Misaligned>
- **Missing items**: <list any acceptance criteria not covered, or "None">

### Code review findings

#### Correctness
<Any bugs, logic errors, or missing edge cases>

#### Style & conventions
<Naming, formatting, or pattern inconsistencies with the rest of the codebase>

#### Security
<Any concerns — exposed secrets, injection risks, missing validation>

#### Suggestions
<Optional improvements that aren't blockers — better naming, simplification, etc.>

### Verdict
<**Approve** / **Request changes** / **Comment only**> — <one-sentence justification>
```

Guidelines for a good review:
- Be specific — reference file names and line numbers, not vague observations.
- Distinguish **blockers** (things that need to change before merging) from
  **suggestions** (nice-to-haves). Treating everything as a blocker slows teams
  down; never blocking lets bugs through.
- If the PR looks good, say so briefly. Don't invent issues to seem thorough.
- Check the test plan items in the PR body — are they reasonable? Would you
  add any?

### 6. Submit the review (if requested)

If the user asks to submit the review on GitHub (not just discuss it locally),
post it. Always confirm the verdict with the user before submitting — a submitted
review is visible to the PR author and the team.

```bash
gh pr review <number> --approve --body "<review comments>"
# or
gh pr review <number> --request-changes --body "<review comments>"
# or
gh pr review <number> --comment --body "<review comments>"
```
