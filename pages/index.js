import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState("");
  const [dailyContext, setDailyContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          daily_context: dailyContext,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to fetch from backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>🗂️ Task Delegator</h1>

      <form onSubmit={handleSubmit}>
        <label>Tasks (comma separated):</label>
        <textarea
          rows="4"
          style={{ width: "100%" }}
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder="e.g. Respond to emails, Write report"
          required
        />

        <label>Daily Context (optional):</label>
        <textarea
          rows="2"
          style={{ width: "100%" }}
          value={dailyContext}
          onChange={(e) => setDailyContext(e.target.value)}
          placeholder="e.g. Morning focus block"
        />

        <button
          type="submit"
          style={{ marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Run Delegator"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>✅ Result</h2>
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
