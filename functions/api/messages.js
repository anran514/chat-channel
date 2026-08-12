export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
        return new Response(null, { headers });
    }
    if (request.method === "GET") {
        const res = await db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
        return Response.json(res.results, { headers });
    }
    if (request.method === "POST") {
        const { username, text, time, timestamp } = await request.json();
        await db.prepare(`
            INSERT INTO messages (username, text, time, timestamp)
            VALUES (?,?,?,?)
        `).bind(username, text, time, timestamp).run();
        return Response.json({ ok: true }, { headers });
    }
    if (request.method === "DELETE") {
        await db.prepare("DELETE FROM messages").run();
        return Response.json({ ok: true }, { headers });
    }
    return new Response("请求方式不支持", { status: 405, headers });
}
