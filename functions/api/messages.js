export default {
  async onFetch(request, env) {
    const db = env.DB;
    // 获取所有消息
    if (request.method === "GET") {
      const { results } = await db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
      return new Response(JSON.stringify(results), {
        headers: { "content-type": "application/json" }
      });
    }
    // 发送新消息
    if (request.method === "POST") {
      const { username, text } = await request.json();
      const now = Date.now();
      await db.prepare(`
        INSERT INTO messages (username, text, time, timestamp)
        VALUES (?, ?, ?, ?)
      `).bind(username, text, new Date(now).toLocaleString(), now).run();
      return new Response(JSON.stringify({ok:true}));
    }
    return new Response("方法错误", {status:405})
  }
}
