#!/usr/bin/env sh
# Mostra URLs para abrir Fleet AI no celular (mesma rede Wi-Fi)

PORT="${1:-3000}"
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -z "$IP" ]; then
  IP=$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
fi

echo ""
echo "  Fleet AI — Acesso mobile"
echo "  ========================="
if [ -n "$IP" ]; then
  echo "  Celular (mesma Wi-Fi):"
  echo "  http://${IP}:${PORT}"
  echo ""
  echo "  PC nesta máquina:"
  echo "  http://localhost:${PORT}"
else
  echo "  Não foi possível detectar o IP. Use: hostname -I"
fi
echo ""
