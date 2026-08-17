#!/usr/bin/env bash
set -euo pipefail
systemctl --user disable --now arcana-activity-hub.service 2>/dev/null || true
rm -f "$HOME/.config/systemd/user/arcana-activity-hub.service"
systemctl --user daemon-reload
echo "Autostart do Arcana removido. Seus arquivos e dados do Firefox não foram apagados."
