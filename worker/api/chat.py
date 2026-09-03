"""Vercel Python Function for the NVIDIA chat-completions proxy.

Set AI_TOKEN and ALLOWED_ORIGINS in Vercel Project Settings, not in this file.
"""

import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "google/gemma-4-31b-it"
MAX_BODY_BYTES = 60_000
MAX_MESSAGES = 8
MAX_MESSAGE_CHARS = 7_000
SYSTEM_PROMPT = (
    "Bạn là Trợ lý điều hành HTX số cho nông nghiệp Việt Nam. Chỉ sử dụng dữ "
    "liệu trong CONTEXT; không suy đoán số liệu, giá thị trường, chẩn đoán sâu "
    "bệnh hay khuyến nghị liều lượng thuốc khi CONTEXT không có bằng chứng. Khi "
    "dữ liệu thiếu, phải ghi rõ 'Chưa đủ dữ liệu' và liệt kê trường cần bổ sung. "
    "Không đưa hướng dẫn sử dụng thuốc BVTV cụ thể; yêu cầu cán bộ kỹ thuật/nhãn "
    "sản phẩm xác nhận. Trả lời tiếng Việt, ngắn gọn, theo đúng cấu trúc: "
    "1) Kết luận; 2) Bằng chứng dữ liệu; 3) Rủi ro/mức độ tin cậy; "
    "4) Việc cần làm tiếp theo."
)


def allowed_origins():
    return {
        item.strip().rstrip("/")
        for item in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if item.strip()
    }


class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Do not write request headers or bodies to Vercel logs.
        print("%s - %s" % (self.client_address[0], format % args))

    def cors_headers(self):
        origin = self.headers.get("Origin", "").rstrip("/")
        return {
            "Access-Control-Allow-Origin": origin if origin in allowed_origins() else "null",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Vary": "Origin",
        }

    def send_json(self, status, body):
        payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()

    def do_GET(self):
        self.send_json(200, {"status": "ok", "service": "nvidia-ai-proxy"})

    def do_POST(self):
        token = os.getenv("AI_TOKEN")
        if not token:
            self.send_json(503, {"error": "AI proxy is not configured"})
            return

        origin = self.headers.get("Origin", "").rstrip("/")
        if origin and origin not in allowed_origins():
            self.send_json(403, {"error": "Origin is not allowed"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > MAX_BODY_BYTES:
                raise ValueError("Invalid body length")
            request_body = json.loads(self.rfile.read(content_length))
            incoming = request_body.get("messages", [])
            if not isinstance(incoming, list):
                raise ValueError("messages must be an array")
            messages = [
                {"role": message["role"], "content": message["content"][:MAX_MESSAGE_CHARS]}
                for message in incoming[-MAX_MESSAGES:]
                if isinstance(message, dict)
                and message.get("role") in ("user", "assistant")
                and isinstance(message.get("content"), str)
            ]
            if not any(message["role"] == "user" for message in messages):
                raise ValueError("A user message is required")
        except (UnicodeDecodeError, ValueError, json.JSONDecodeError):
            self.send_json(400, {"error": "Invalid request"})
            return

        provider_payload = json.dumps({
            "model": MODEL,
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}, *messages],
            "chat_template_kwargs": {"enable_thinking": True},
            "max_tokens": 16384,
            "stream": False,
            "temperature": 1,
            "top_p": 0.95,
        }).encode("utf-8")
        provider_request = Request(
            NVIDIA_URL,
            data=provider_payload,
            method="POST",
            headers={
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )
        try:
            with urlopen(provider_request, timeout=30) as response:
                response_body, status = response.read(), response.status
        except HTTPError as error:
            response_body, status = error.read(), error.code
        except (URLError, TimeoutError):
            self.send_json(502, {"error": "NVIDIA AI provider is unavailable"})
            return

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_body)))
        for name, value in self.cors_headers().items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(response_body)
