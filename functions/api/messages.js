export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    // 跨域预检放行
    if (request.method === "OPTIONS") {
        return new Response(null, { headers });
    }
    // 获取全部消息
    if (request.method === "GET") {
        const res = await db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
        return Response.json(res.results, { headers });
    }
    // 发送新消息
    if (request.method === "POST") {
        const { username, text, time, timestamp } = await request.json();
        await db.prepare(`
            INSERT INTO messages (username, text, time, timestamp)
            VALUES (?,?,?,?)
        `).bind(username, text, time, timestamp).run();
        return Response.json({ ok: true }, { headers });
    }
    // 清空所有消息
    if (request.method === "DELETE") {
        await db.prepare("DELETE FROM messages").run();
        return Response.json({ ok: true }, { headers });
    }
    return new Response("请求方式不支持", { status: 405, headers });
}
