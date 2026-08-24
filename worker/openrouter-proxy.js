const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemma-4-26b-a4b-it:free";

const SYSTEM_PROMPT = `Bạn là Trợ lý điều hành HTX số cho nông nghiệp Việt Nam. Chỉ sử dụng dữ liệu trong CONTEXT; không suy đoán số liệu, giá thị trường, chẩn đoán sâu bệnh hay khuyến nghị liều lượng thuốc khi CONTEXT không có bằng chứng. Khi dữ liệu thiếu, phải ghi rõ "Chưa đủ dữ liệu" và liệt kê trường cần bổ sung. Không đưa hướng dẫn sử dụng thuốc BVTV cụ thể; yêu cầu cán bộ kỹ thuật/nhãn sản phẩm xác nhận. Trả lời tiếng Việt, ngắn gọn, theo đúng cấu trúc: 1) Kết luận; 2) Bằng chứng dữ liệu; 3) Rủi ro/mức độ tin cậy; 4) Việc cần làm tiếp theo. Với dự báo, luôn nêu giả định, phạm vi thời gian và không gọi đó là số liệu thực tế.`;

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = origin === env.ALLOWED_ORIGIN || origin.startsWith("http://localhost:");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);
    if (!env.AI_TOKEN) return json({ error: "AI proxy is not configured" }, 503, cors);

    try {
      const body = await request.json();
      const incoming = Array.isArray(body.messages) ? body.messages : [];
      const messages = incoming
        .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message?.content === "string")
        .slice(-8)
        .map((message) => ({ role: message.role, content: message.content.slice(0, 7000) }));
      if (!messages.some((message) => message.role === "user")) return json({ error: "A user message is required" }, 400, cors);

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.AI_TOKEN}` },
        body: JSON.stringify({ model: MODEL, stream: false, temperature: 0.2, max_tokens: 900, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages] }),
      });
      const payload = await response.text();
      return new Response(payload, { status: response.status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors } });
    } catch {
      return json({ error: "Invalid request or upstream AI error" }, 502, cors);
    }
  },
};
