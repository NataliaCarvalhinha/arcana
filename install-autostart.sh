#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICE_DIR="$HOME/.config/systemd/user"
SERVICE_FILE="$SERVICE_DIR/arcana-activity-hub.service"

mkdir -p "$SERVICE_DIR"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Arcana Activity Hub local homepage
After=network-online.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/start.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable --now arcana-activity-hub.service

echo
echo "Arcana configurado para iniciar automaticamente."
echo "Homepage: http://127.0.0.1:8765"
echo
echo "Status:"
systemctl --user --no-pager --full status arcana-activity-hub.service || true
