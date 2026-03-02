from flask_cloudflared import _run_cloudflared
import time

# Expose port 5000 using Cloudflare
print("Starting Cloudflare tunnel on port 5000...")
try:
    _run_cloudflared(5000, 5000)
    print("Cloudflare tunnel is running! Check the output above for the 'https://...trycloudflare.com' link.")
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Tunnel closed.")
