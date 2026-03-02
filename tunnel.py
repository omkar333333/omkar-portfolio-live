from pyngrok import ngrok
import time

# Create an ngrok tunnel to the local port 5000
public_url = ngrok.connect(5000)
print("=" * 60)
print("YOUR GLOBAL LINK IS:")
print(f"--> {public_url} <--")
print("=" * 60)
print("Keep this terminal open! Press Ctrl+C to close the tunnel.")

try:
    # Keep the process alive
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Closing tunnel...")
    ngrok.kill()
