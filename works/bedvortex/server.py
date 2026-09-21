#!/usr/bin/env python3
"""带 no-cache 头的本地静态服务器, 保证每次刷新都拿到最新文件"""
import http.server, socketserver, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
    def log_message(self, fmt, *args):
        pass  # 静默日志

with socketserver.ThreadingTCPServer(("127.0.0.1", 8901), NoCache) as httpd:
    httpd.allow_reuse_address = True
    print("serving on http://localhost:8901 (no-cache)")
    httpd.serve_forever()
