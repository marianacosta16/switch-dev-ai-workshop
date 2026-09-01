# AI for Developers — Presenter Notes

**Presenter:** Ricardo Silva
**Date:** 2026

---

## Slide 1: Title Slide

_AI for Developers — Understanding the New Stack_

- Welcome the audience. Introduce yourself and your background.
- Set the tone: this is a practical, grounded overview — not hype, not fear.
- Frame the session: "By the end, you'll understand the building blocks behind every AI product you'll work with."
- Mention that AI is not replacing developers — it's becoming a tool in the developer's toolkit, and understanding it is now a professional advantage.

---

## Slide 2: What is an LLM?

- Start with the acronym: Large Language Model.
- Explain at a high level: trained on massive text data, learns statistical patterns of language, generates text by predicting the next token.
- Key insight for developers: it's not a database — it doesn't "know" things. It predicts plausible continuations. This distinction matters for building reliable systems.
- Mention scale: billions of parameters, trained on trillions of tokens.
- Draw the analogy: autocomplete on steroids, but with emergent reasoning capabilities.
- Name a few models they'll encounter: Claude, GPT, Gemini, Llama, Mistral.

---

## Slide 3: Tokens & Context Windows

- Define tokens: the atomic units LLMs work with. Not words — subword pieces. "unhappiness" might be 3 tokens.
- Context window: the total number of tokens the model can see at once (input + output). Think of it as the model's working memory.
- Why it matters for developers: context window size determines how much information you can feed the model. Too little context = poor answers. Too much = cost and latency.
- Mention current ranges: from 8K to 200K+ tokens depending on the model.
- Practical tip: always be aware of what you're putting into the context and why.

---

## Slide 4: Prompt Engineering

- Define it simply: the skill of writing effective instructions for LLMs.
- Three techniques to highlight:
  - **Zero-shot**: just ask the question directly.
  - **Few-shot**: give examples of input → output before your actual question.
  - **Chain-of-thought**: ask the model to reason step by step.
- Emphasize: prompt engineering is not magic incantations — it's clear communication. The same skills that make you good at writing specs make you good at prompting.
- Show the progression: a vague prompt vs. a specific one, and how outputs differ dramatically.

---

## Slide 5: What is an Agent?

- An agent is an LLM that can take actions — not just generate text, but use tools, make decisions, and work through multi-step tasks.
- The loop: Think → Act → Observe → Repeat.
- Key difference from a chatbot: an agent has autonomy. You give it a goal, and it figures out the steps.
- Real-world analogy: a chatbot is like asking someone a question. An agent is like delegating a task.
- Mention that agents are where the industry is heading — this is the "agentic" era.

---

## Slide 6: Sub-Agents & Orchestration

- As tasks get complex, a single agent isn't enough. You break work into specialized sub-agents.
- Architecture pattern: an orchestrator agent delegates to specialist sub-agents, each with their own tools and focus.
- Example: a coding agent might spawn a "research" sub-agent to explore the codebase and a "test" sub-agent to verify changes — running in parallel.
- Benefits: parallelism, separation of concerns, context isolation (each sub-agent has a focused context window).
- This is how production AI systems are built today.

---

## Slide 7: Skills & Commands

- Skills are reusable, packaged capabilities that an agent can invoke — think of them like plugins or scripts with domain expertise baked in.
- Commands (slash commands) are user-facing entry points that trigger skills or workflows. Example: `/code-review` launches a code review skill.
- Why it matters: skills make agents composable. Instead of one monolithic prompt, you build a library of capabilities that agents can mix and match.
- For developers: you can create custom skills tailored to your team's workflows — deployment checks, documentation generation, security audits.

---

## Slide 8: MCP — Model Context Protocol

- MCP is an open standard for connecting AI models to external tools and data sources.
- Analogy: USB-C for AI. A universal interface that lets any model talk to any tool — databases, APIs, file systems, GitHub, Slack, etc.
- Architecture: MCP Servers expose tools → MCP Clients (the AI) discover and call them.
- Why developers should care: instead of building custom integrations for every AI tool, you build one MCP server and every AI client can use it.
- This is the infrastructure layer that makes agents practical in real environments.

---

## Slide 9: RAG — Retrieval-Augmented Generation

- The problem: LLMs have a knowledge cutoff and can hallucinate. They don't know about your company's data.
- The solution: retrieve relevant documents at query time and inject them into the prompt.
- The pipeline: User question → Search your data → Feed relevant chunks to the LLM → Get a grounded answer.
- Key insight: RAG lets you give an LLM access to private, up-to-date information without retraining it.
- This is how most enterprise AI products work today — customer support bots, internal knowledge bases, code assistants.

---

## Slide 10: AI-Assisted Development

- AI is already changing how we write code — daily.
- Tools to know: Claude Code (CLI agent), GitHub Copilot (inline suggestions), Cursor (AI-native editor).
- What they actually do: autocomplete, refactoring, debugging, test generation, code review, explaining unfamiliar codebases.
- The shift: you spend less time on boilerplate and syntax, more time on architecture and problem-solving.
- Advice for new developers: learn to code *with* AI, not *instead of* learning to code. AI is a multiplier — it multiplies what you already know.

---

## Slide 11: Hallucinations & Limitations

- LLMs confidently generate plausible-sounding but incorrect information. This is called hallucination.
- Why it happens: the model optimizes for plausibility, not truth. It has no internal fact-checker.
- Types: factual errors, invented citations, confident nonsense, subtle logical mistakes.
- Mitigation strategies:
  - Ground with RAG (give it real data).
  - Ask for citations and verify them.
  - Use structured outputs and validation.
  - Human-in-the-loop for critical decisions.
- The developer's responsibility: never trust LLM output in safety-critical paths without verification.

---

## Slide 12: Ethics & Responsible AI

- Bias: models inherit biases from training data. Be aware of this in hiring tools, content moderation, any user-facing system.
- Privacy: don't send sensitive data to third-party APIs without understanding data retention policies.
- Transparency: users should know when they're interacting with AI.
- Job impact: frame honestly — AI will change roles, not eliminate the need for developers. Adaptability is the skill.
- Your responsibility as builders: you're shaping how this technology is used. Build thoughtfully.

---

## Slide 13: What's Next

- Multi-modal models: text, images, audio, video — all in one model.
- Computer use: agents that can operate GUIs, browse the web, use apps like a human would.
- Autonomous agents: longer-running, more independent agents that can handle complex projects.
- The developer's edge: understanding these building blocks puts you ahead. The tools will change — the concepts won't.
- Encourage continuous learning: follow the space, build small projects, experiment.

---

## Slide 14: Closing

- Recap the key concepts: LLMs, tokens, prompts, agents, sub-agents, skills, MCP, RAG.
- Reinforce the message: AI is a tool. Your job is to understand it well enough to use it wisely.
- Open the floor for questions.
- Share any resources or links for further learning.
