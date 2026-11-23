#!/usr/bin/env python3
"""
Startup Connect Rwanda - Static Server Launcher
Serves the client-side single-page interface and static assets using Python's built-in HTTP server.
"""

import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8000))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root_dir)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Startup Connect Rwanda static server is running at: http://localhost:{PORT}")
        print("Press Ctrl+C to terminate the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shut down cleanly.")
            sys.exit(0)

if __name__ == "__main__":
    main()
