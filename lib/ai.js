// lib/ai.js
// Talks to a locally running Ollama instance instead of the Anthropic API.
// Make sure Ollama is installed and running, and you've pulled the model:
//   ollama pull llama3.1
//   ollama serve   (usually already running as a background service)
//
// OLLAMA_HOST defaults to Ollama's default local port — override in
// .env.local if you're running Ollama elsewhere (e.g. Docker, another
// machine on your network).

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

export async function askClaude(prompt, { json = false } = {}) {
  let res;
  try {
    res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        ...(json ? { format: "json" } : {}),
      }),
    });
  } catch (e) {
    throw new Error(
      `Couldn't reach Ollama at ${OLLAMA_HOST}. Is "ollama serve" running? (${e.message})`
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ollama request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data?.message?.content || "").trim();

  if (json) {
    const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      throw new Error("Ollama did not return valid JSON: " + text.slice(0, 200));
    }
  }
  return text;
}