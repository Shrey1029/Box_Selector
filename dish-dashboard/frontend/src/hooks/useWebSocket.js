import { useEffect, useRef } from "react";

const WS_URL = "ws://localhost:8000/ws";

export function useWebSocket(onMessage) {
  const wsRef = useRef(null);
  const pingRef = useRef(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        // Keep-alive ping every 25s
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 25000);
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          onMessage(data);
        } catch {}
      };

      ws.onclose = () => {
        clearInterval(pingRef.current);
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      clearInterval(pingRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);
}
