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
        body: JSON.stringify({ tasks, daily_context: dailyContext }),
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

  // Helper for pretty date
  const formatDate = (iso) => {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        📂 Task Delegator
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 border rounded shadow"
      >
        <div>
          <label className="block font-semibold mb-1">
            Tasks (comma separated):
          </label>
          <textarea
            rows="3"
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="e.g. Respond to emails, Write report"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Daily Context (optional):
          </label>
          <textarea
            rows="2"
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={dailyContext}
            onChange={(e) => setDailyContext(e.target.value)}
            placeholder="e.g. Morning focus block"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Run Delegator"}
        </button>
      </form>

      {result && (
        <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
            ✅ Result
          </h2>

          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p className="mb-2">📌 {result.action_summary}</p>
              <p className="mb-4">✅ {result.calendar_confirmation}</p>

              <h3 className="font-semibold mb-2">🗓️ Planned Schedule:</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.daily_schedule?.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.summary}</strong> — {formatDate(item.start)} to{" "}
                    {formatDate(item.end)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </main>
  );
}
