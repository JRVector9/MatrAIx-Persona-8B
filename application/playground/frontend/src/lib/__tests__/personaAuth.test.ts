import { describe, expect, it } from "vitest";

import {
  personaAuthDefaultModel,
  personaAuthLaunchFields,
  personaAuthModelOptions,
} from "../personaAgentCatalog";

const MODEL_OPTIONS = [
  { value: "anthropic/claude-haiku-4-5", label: "Claude Haiku 4.5" },
  { value: "anthropic/claude-sonnet-5", label: "Claude Sonnet 5" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { value: "openai/gpt-5.4", label: "GPT-5.4" },
  { value: "openai/gpt-5.5", label: "GPT-5.5" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

describe("persona auth", () => {
  it("keeps the default API-key launch untouched", () => {
    expect(personaAuthLaunchFields("api")).toEqual({});
    expect(personaAuthModelOptions("api", MODEL_OPTIONS)).toEqual(MODEL_OPTIONS);
  });

  it("runs the Claude Code subscription on persona-claude-code with Anthropic models", () => {
    expect(personaAuthLaunchFields("claude-code")).toEqual({
      mode: "force_docker",
      agentName: "persona-claude-code",
      cliSubscription: true,
    });
    expect(personaAuthModelOptions("claude-code", MODEL_OPTIONS).map((opt) => opt.value)).toEqual([
      "anthropic/claude-haiku-4-5",
      "anthropic/claude-sonnet-5",
    ]);
  });

  it("starts each subscription on its default model", () => {
    expect(personaAuthDefaultModel("api")).toBeNull();
    expect(personaAuthDefaultModel("claude-code")).toBe("anthropic/claude-sonnet-5");
    expect(personaAuthDefaultModel("codex")).toBe("openai/gpt-5.5");
  });

  it("runs the Codex subscription on persona-codex with ChatGPT-account models only", () => {
    expect(personaAuthLaunchFields("codex")).toEqual({
      mode: "force_docker",
      agentName: "persona-codex",
      cliSubscription: true,
    });
    expect(personaAuthModelOptions("codex", MODEL_OPTIONS).map((opt) => opt.value)).toEqual([
      "openai/gpt-5.5",
    ]);
  });
});
