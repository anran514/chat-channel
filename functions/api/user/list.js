export default {
  async onFetch(request, env) {
    const db = env.DB;
    if(request.method !== "POST") return new Response("禁止访问",{status:405})
    const { name } = await request.json();
    const now = Date.now();
    // 存在就更新活跃时间，不存在新增
    await db.prepare(`
      INSERT INTO users (name, lastActive) VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET lastActive = ?
    `).bind(name, now, now).run();
    return new Response(JSON.stringify({success:true}))
  }
}
