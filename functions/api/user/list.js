export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers });
    // 更新在线时间
    if (request.method === "POST") {
        const { name, lastActive } = await request.json();
        await db.prepare(`
            INSERT INTO users (name, lastActive) VALUES (?, ?)
            ON CONFLICT(name) DO UPDATE SET lastActive = ?
        `).bind(name, lastActive, lastActive).run();
        return Response.json({ ok: true }, { headers });
    }
    // 获取所有在线用户
    if (request.method === "GET") {
        const result = await db.prepare("SELECT * FROM users").all();
        return Response.json(result.results, { headers });
    }
    // 清空用户记录
    if (request.method === "DELETE") {
        await db.prepare("DELETE FROM users").run();
        return Response.json({ ok: true }, { headers });
    }
    return new Response("方法禁止", { status: 405, headers });
}
