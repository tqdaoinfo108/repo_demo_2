"""Small server-side NVIDIA Integrate proxy.

AI_TOKEN is kept in this server-side file. Never put it in a browser variable
(NEXT_PUBLIC_*) or commit the file to Git after adding a real key.
"""

import json
import os
import time
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
# Key NVIDIA Integrate được giữ ở backend; không dùng tiền tố NEXT_PUBLIC_.
AI_TOKEN = "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"
MODEL = "google/gemma-4-31b-it"
PORT = int(os.getenv("PORT", "443"))
MAX_BODY_BYTES = 60_000
MAX_MESSAGES = 8
MAX_MESSAGE_CHARS = 7_000
RATE_LIMIT_REQUESTS = 20
RATE_LIMIT_WINDOW_SECONDS = 60

SYSTEM_PROMPT = (
    "Bạn là Trợ lý điều hành HTX số cho nông nghiệp Việt Nam. Chỉ sử dụng dữ "
    "liệu trong CONTEXT; không suy đoán số liệu, giá thị trường, chẩn đoán sâu "
    "bệnh hay khuyến nghị liều lượng thuốc khi CONTEXT không có bằng chứng. Khi "
    "dữ liệu thiếu, phải ghi rõ 'Chưa đủ dữ liệu' và liệt kê trường cần bổ sung. "
    "Không đưa hướng dẫn sử dụng thuốc BVTV cụ thể; yêu cầu cán bộ kỹ thuật/nhãn "
    "sản phẩm xác nhận. Trả lời tiếng Việt, ngắn gọn, theo đúng cấu trúc: "
    "1) Kết luận; 2) Bằng chứng dữ liệu; 3) Rủi ro/mức độ tin cậy; "
    "4) Việc cần làm tiếp theo. Với dự báo, luôn nêu giả định, phạm vi thời gian "
    "và không gọi đó là số liệu thực tế."
)

# Comma-separated exact browser origins, e.g. https://app.example.vn.
ALLOWED_ORIGINS = {
    origin.strip().rstrip("/")
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:443").split(",")
    if origin.strip()
}
REQUESTS_BY_IP = defaultdict(deque)


def allow_request(ip: str) -> bool:
    """A small in-memory guard. Use a real shared rate limiter for multiple instances."""
    now = time.monotonic()
    timestamps = REQUESTS_BY_IP[ip]
    while timestamps and timestamps[0] <= now - RATE_LIMIT_WINDOW_SECONDS:
        timestamps.popleft()
    if len(timestamps) >= RATE_LIMIT_REQUESTS:
        return False
    timestamps.append(now)
    return True


class ProxyHandler(BaseHTTPRequestHandler):
    server_version = "AIProxy/1.0"

    def log_message(self, format, *args):
        # Do not log request bodies or headers: they may contain user content.
        print("%s - %s" % (self.client_address[0], format % args))

    def cors_headers(self):
        origin = self.headers.get("Origin", "").rstrip("/")
        return {
            "Access-Control-Allow-Origin": origin if origin in ALLOWED_ORIGINS else "null",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Vary": "Origin",
        }

    def send_json(self, status: int, body: dict):
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(encoded)

    def do_OPTIONS(self):
        self.send_response(204)
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()

    def do_POST(self):
        # Accept both forms so NEXT_PUBLIC_AI_PROXY_URL can be either the
        # deployed base URL or the full /v1/chat/completions endpoint.
        if self.path not in ("/", "/v1/chat/completions"):
            self.send_json(404, {"error": "Not found"})
            return

        origin = self.headers.get("Origin", "").rstrip("/")
        if origin and origin not in ALLOWED_ORIGINS:
            self.send_json(403, {"error": "Origin is not allowed"})
            return
        if not allow_request(self.client_address[0]):
            self.send_json(429, {"error": "Too many requests; try again shortly"})
            return

        if not AI_TOKEN:
            self.send_json(503, {"error": "AI proxy is not configured"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY_BYTES:
                raise ValueError("Request body is too large or missing")
            body = json.loads(self.rfile.read(length))
            incoming = body.get("messages", [])
            if not isinstance(incoming, list):
                raise ValueError("messages must be an array")
            messages = [
                {"role": item["role"], "content": item["content"][:MAX_MESSAGE_CHARS]}
                for item in incoming[-MAX_MESSAGES:]
                if isinstance(item, dict)
                and item.get("role") in ("user", "assistant")
                and isinstance(item.get("content"), str)
            ]
            if not any(item["role"] == "user" for item in messages):
                raise ValueError("A user message is required")
        except (UnicodeDecodeError, ValueError, json.JSONDecodeError):
            self.send_json(400, {"error": "Invalid request"})
            return

        upstream_body = json.dumps({
            "model": MODEL,
            "stream": False,
            "temperature": 1,
            "top_p": 0.95,
            "max_tokens": 16384,
            "chat_template_kwargs": {"enable_thinking": True},
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}, *messages],
        }).encode("utf-8")
        request = Request(
            NVIDIA_URL,
            data=upstream_body,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + AI_TOKEN,
            },
        )
        try:
            with urlopen(request, timeout=30) as response:
                payload = response.read()
                status = response.status
        except HTTPError as error:
            # Forward the provider's non-sensitive JSON error, preserving its status.
            payload, status = error.read(), error.code
        except (URLError, TimeoutError):
            self.send_json(502, {"error": "AI provider is unavailable"})
            return

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(payload)


if __name__ == "__main__":
    if not AI_TOKEN:
        raise SystemExit("Dán NVIDIA API key vào biến AI_TOKEN trong file này.")
    print(f"AI proxy listening on http://0.0.0.0:{PORT}/v1/chat/completions")
    ThreadingHTTPServer(("0.0.0.0", PORT), ProxyHandler).serve_forever()
