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

    if (request.method === "POST") {
        const { name, lastActive } = await request.json();
        await db.prepare(`INSERT INTO users (name, lastActive) VALUES (?, ?)`)
        .bind(name, lastActive).run();
        return Response.json({ ok: true }, { headers });
    }

    if (request.method === "GET") {
        const result = await db.prepare("SELECT name, lastActive FROM users").all();
        return Response.json(result.results, { headers });
    }

    if (request.method === "DELETE") {
        await db.prepare("DELETE FROM users").run();
        return Response.json({ ok: true }, { headers });
    }
    return new Response("方法禁止", { status: 405, headers });
}
