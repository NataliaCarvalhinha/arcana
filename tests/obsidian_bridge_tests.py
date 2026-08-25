import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


FIXED = "2026-08-18T00:00:00Z"
PAIRING_TOKEN = "test-pairing-token"
PAGES_ORIGIN = "https://nataliacarvalhinha.github.io"
LOCAL_ORIGIN = "http://127.0.0.1:8765"
EVIL_ORIGIN = "https://evil.example"


def sample_payload(status="active"):
    return {
        "state": {
            "tracks": [{"id": "track-1", "name": "Arcana Track"}],
            "items": [
                {
                    "id": "course-1",
                    "kind": "course",
                    "trackId": "track-1",
                    "title": "Curso Arcana",
                    "createdAt": FIXED,
                    "updatedAt": FIXED,
                    "modules": [
                        {
                            "id": "module-1",
                            "title": "Modulo 1",
                            "lessons": [
                                {
                                    "id": "lesson-1",
                                    "title": "Licao / 1",
                                    "url": "https://example.test/video?t=42",
                                    "done": True,
                                }
                            ],
                        }
                    ],
                }
            ],
        },
        "notes": [
            {
                "id": "note-1",
                "title": "Ideia Unica",
                "type": "permanent",
                "trackId": "track-1",
                "content": "# Ideia Unica\n\nCorpo #tag\n",
                "sourceType": "course",
                "sourceId": "lesson-1",
                "source": {
                    "courseId": "course-1",
                    "moduleId": "module-1",
                    "lessonId": "lesson-1",
                    "title": "Licao / 1",
                    "url": "https://example.test/video?t=42",
                    "timestamp": "00:42",
                },
                "createdAt": FIXED,
                "updatedAt": FIXED,
                "status": status,
            }
        ],
        "flashcards": [
            {
                "id": "card-1",
                "front": "Pergunta?",
                "back": "Resposta",
                "createdAt": FIXED,
                "updatedAt": FIXED,
            }
        ],
    }


class ObsidianBridgeTests(unittest.TestCase):
    def setUp(self):
        self._original_local_config_path = server.LOCAL_CONFIG_PATH
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp_path = Path(self._tmp.name)
        server.LOCAL_CONFIG_PATH = self.tmp_path / ".arcana-local.json"

    def tearDown(self):
        server.LOCAL_CONFIG_PATH = self._original_local_config_path
        self._tmp.cleanup()

    def configure_bridge(self, vault=None, connected=True, token=PAIRING_TOKEN):
        obsidian = {
            "connected": bool(connected and vault),
            "vaultPath": str(vault) if connected and vault else "",
            "vaultName": vault.name if connected and vault else "",
            "lastSyncAt": None,
            "autoSync": "manual",
            "tracked": {},
            "conflicts": [],
            "lastPush": {},
        }
        server.save_local_config({
            "obsidian": obsidian,
            "bridge": {
                "name": server.BRIDGE_NAME,
                "version": server.BRIDGE_VERSION,
                "apiVersion": server.BRIDGE_API_VERSION,
                "token": token,
                "createdAt": FIXED,
            },
        })

    def start_bridge_server(self):
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(httpd.shutdown)
        self.addCleanup(httpd.server_close)
        return f"http://127.0.0.1:{httpd.server_address[1]}"

    def bridge_request(self, base, path, method="GET", origin=PAGES_ORIGIN, token=None, payload=None, extra_headers=None):
        data = None
        headers = {"Origin": origin}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        if token:
            headers[server.BRIDGE_TOKEN_HEADER] = token
        headers.update(extra_headers or {})
        req = urllib.request.Request(f"{base}{path}", data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                raw = resp.read().decode("utf-8")
                body = json.loads(raw) if raw else {}
                return resp.status, dict(resp.headers), body
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode("utf-8")
            body = json.loads(raw) if raw else {}
            return exc.code, dict(exc.headers), body

    def test_render_uses_phase_one_vault_shape(self):
        files = server.render_obsidian_export(sample_payload())
        paths = {item["path"] for item in files}

        self.assertIn("Arcana Index.md", paths)
        self.assertIn("README - Arcana.md", paths)
        self.assertIn("Courses/Curso Arcana.md", paths)
        self.assertIn("Tracks/Arcana Track.md", paths)
        self.assertTrue(any(path.startswith("60 Fontes/") for path in paths))
        self.assertTrue(any(path.startswith("80 Flashcards/") for path in paths))
        self.assertFalse(any(path.startswith("Arcana/") for path in paths))
        self.assertFalse(any("Arcana Obsidian Vault" in path for path in paths))

        note = next(item for item in files if item["arcana_id"] == "note-1")
        self.assertIn("arcana_managed: true", note["text"])
        self.assertIn("arcana_id: note-1", note["text"])
        self.assertIn("course_id: course-1", note["text"])
        self.assertIn("module_id: module-1", note["text"])
        self.assertIn("lesson_id: lesson-1", note["text"])

    def test_focus_session_and_questions_export_as_first_class_markdown(self):
        payload = sample_payload()
        payload["notes"] = [
            {
                "id": "session-1",
                "title": "Sessao - Licao 1",
                "type": "session",
                "trackId": "track-1",
                "courseId": "course-1",
                "moduleId": "module-1",
                "lessonId": "lesson-1",
                "sourceType": "lesson",
                "sourceId": "lesson-1",
                "sourceTitle": "Licao / 1",
                "sessionId": "study-session-1",
                "durationMinutes": 35,
                "content": "Resumo livre",
                "blocks": [
                    {"id": "block-1", "type": "concept", "title": "Market Efficiency", "content": "Definition"},
                    {"id": "block-2", "type": "question", "title": "Why do bubbles persist?", "content": "Investigate"},
                    {"id": "block-3", "type": "next_action", "title": "Review chapter 4", "content": ""},
                ],
                "createdAt": FIXED,
                "updatedAt": FIXED,
                "status": "active",
            },
            {
                "id": "question-1",
                "title": "Why do bubbles persist?",
                "type": "question",
                "trackId": "track-1",
                "courseId": "course-1",
                "moduleId": "module-1",
                "lessonId": "lesson-1",
                "sourceType": "lesson",
                "sourceId": "lesson-1",
                "questionStatus": "open",
                "content": "Question context",
                "createdAt": FIXED,
                "updatedAt": FIXED,
            },
        ]

        files = server.render_obsidian_export(payload)
        paths = {item["path"] for item in files}
        self.assertIn("50 Sessões/Sessao - Licao 1.md", paths)
        self.assertIn("40 Perguntas/Why do bubbles persist.md", paths)

        session = next(item for item in files if item["arcana_id"] == "session-1")
        self.assertIn("type: session", session["text"])
        self.assertIn("duration_minutes: 35", session["text"])
        self.assertIn("- [[Market Efficiency]]", session["text"])
        self.assertIn("- [[Why do bubbles persist?]]", session["text"])
        self.assertIn("## Próximos passos", session["text"])
        self.assertNotIn("## Citações", session["text"])

        question = next(item for item in files if item["arcana_id"] == "question-1")
        self.assertIn("type: question", question["text"])
        self.assertIn("question_status: open", question["text"])
        self.assertIn("## Pergunta", question["text"])

    def test_write_preserves_unmanaged_files_and_stable_arcana_id(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        welcome = vault / "Welcome.md"
        welcome.write_text("hello obsidian\n", encoding="utf-8")
        obsidian = vault / ".obsidian"
        obsidian.mkdir()
        settings = obsidian / "app.json"
        settings.write_text('{"theme":"moon"}\n', encoding="utf-8")
        collision = vault / "20 Notas Permanentes" / "Ideia Unica.md"
        collision.parent.mkdir(parents=True)
        collision.write_text("# Minha nota manual\n", encoding="utf-8")

        files = server.render_obsidian_export(sample_payload())
        result, tracked = server.write_obsidian_export(vault, files)
        self.assertTrue(result["ok"], result)
        self.assertEqual(welcome.read_text(encoding="utf-8"), "hello obsidian\n")
        self.assertEqual(settings.read_text(encoding="utf-8"), '{"theme":"moon"}\n')
        self.assertIn("note-1", tracked)
        self.assertEqual(tracked["note-1"]["vaultRelativePath"], "20 Notas Permanentes/Ideia Unica - Arcana 2.md")

        managed_note = vault / tracked["note-1"]["vaultRelativePath"]
        text = managed_note.read_text(encoding="utf-8")
        self.assertIn("arcana_managed: true", text)
        self.assertIn("arcana_id: note-1", text)
        self.assertEqual(collision.read_text(encoding="utf-8"), "# Minha nota manual\n")

        second, second_tracked = server.write_obsidian_export(vault, files)
        self.assertTrue(second["ok"], second)
        self.assertEqual(second_tracked["note-1"]["vaultRelativePath"], tracked["note-1"]["vaultRelativePath"])
        self.assertGreater(second["unchanged"], 0)

        archived = server.render_obsidian_export(sample_payload(status="archived"))
        archived_result, archived_tracked = server.write_obsidian_export(vault, archived)
        self.assertTrue(archived_result["ok"], archived_result)
        self.assertEqual(archived_tracked["note-1"]["vaultRelativePath"], "90 Arquivo/Ideia Unica.md")
        self.assertTrue((vault / "90 Arquivo" / "Ideia Unica.md").exists())
        self.assertEqual(welcome.read_text(encoding="utf-8"), "hello obsidian\n")
        self.assertEqual(settings.read_text(encoding="utf-8"), '{"theme":"moon"}\n')

    def test_bridge_status_cors_identity_allowed_and_rejected(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        self.configure_bridge(vault)
        base = self.start_bridge_server()

        status, headers, body = self.bridge_request(base, "/api/bridge/status", token=PAIRING_TOKEN)
        self.assertEqual(status, 200)
        self.assertEqual(headers.get("Access-Control-Allow-Origin"), PAGES_ORIGIN)
        self.assertTrue(body["ok"])
        self.assertEqual(body["bridge"], "arcana-obsidian")
        self.assertEqual(body["bridgeApiVersion"], 1)
        self.assertTrue(body["vaultConnected"])
        self.assertTrue(body["paired"])
        self.assertIn("obsidian-push", body["capabilities"])
        self.assertEqual(body["obsidian"]["vaultPath"], "")

        denied_status, denied_headers, denied_body = self.bridge_request(
            base,
            "/api/bridge/status",
            method="OPTIONS",
            origin=EVIL_ORIGIN,
            extra_headers={"Access-Control-Request-Method": "POST"},
        )
        self.assertEqual(denied_status, 403)
        self.assertNotEqual(denied_headers.get("Access-Control-Allow-Origin"), "*")
        self.assertEqual(denied_body, {})

    def test_bridge_rejects_missing_and_invalid_token_without_write(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        self.configure_bridge(vault)
        base = self.start_bridge_server()
        body = {"payload": sample_payload()}

        missing_status, _, missing_body = self.bridge_request(base, "/api/obsidian/push", method="POST", payload=body)
        invalid_status, _, invalid_body = self.bridge_request(base, "/api/obsidian/push", method="POST", token="wrong", payload=body)

        self.assertEqual(missing_status, 401)
        self.assertEqual(invalid_status, 401)
        self.assertIn("Pairing code", missing_body["error"])
        self.assertIn("Pairing code", invalid_body["error"])
        self.assertFalse((vault / "20 Notas Permanentes" / "Ideia Unica.md").exists())

    def test_bridge_valid_pairing_push_writes_existing_data(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        self.configure_bridge(vault)
        base = self.start_bridge_server()

        status, headers, body = self.bridge_request(
            base,
            "/api/obsidian/push",
            method="POST",
            token=PAIRING_TOKEN,
            payload={"payload": sample_payload()},
        )

        self.assertEqual(status, 200)
        self.assertEqual(headers.get("Access-Control-Allow-Origin"), PAGES_ORIGIN)
        self.assertTrue(body["ok"], body)
        target = vault / "20 Notas Permanentes" / "Ideia Unica.md"
        self.assertTrue(target.exists())
        text = target.read_text(encoding="utf-8")
        self.assertIn(server.ARCANA_GENERATED_START, text)
        self.assertIn("arcana_id: note-1", text)
        self.assertEqual(body["obsidian"]["vaultPath"], "")

    def test_bridge_blocks_github_pages_vault_connect(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        self.configure_bridge(connected=False)
        base = self.start_bridge_server()

        status, _, body = self.bridge_request(
            base,
            "/api/obsidian/connect",
            method="POST",
            payload={"vaultPath": str(vault)},
        )

        self.assertEqual(status, 403)
        self.assertIn("Arcana Local", body["error"])
        self.assertFalse(server.obsidian_config().get("connected"))

    def test_bridge_allows_local_vault_connect(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        self.configure_bridge(connected=False)
        base = self.start_bridge_server()

        status, _, body = self.bridge_request(
            base,
            "/api/obsidian/connect",
            method="POST",
            origin=LOCAL_ORIGIN,
            token=PAIRING_TOKEN,
            payload={"vaultPath": str(vault)},
        )

        self.assertEqual(status, 201)
        self.assertTrue(body["obsidian"]["connected"])
        self.assertEqual(body["obsidian"]["vaultName"], vault.name)

    def test_manual_obsidian_text_outside_arcana_region_is_preserved(self):
        vault = self.tmp_path / "vault"
        vault.mkdir()
        files = server.render_obsidian_export(sample_payload())
        result, tracked = server.write_obsidian_export(vault, files)
        self.assertTrue(result["ok"], result)
        target = vault / tracked["note-1"]["vaultRelativePath"]
        original = target.read_text(encoding="utf-8")
        target.write_text(original + "\n## Minha nota manual\n\nNao apagar.\n", encoding="utf-8")

        payload = sample_payload()
        payload["notes"][0]["content"] = "# Ideia Unica\n\nCorpo atualizado\n"
        updated = server.render_obsidian_export(payload)
        second, _ = server.write_obsidian_export(vault, updated)
        self.assertTrue(second["ok"], second)
        text = target.read_text(encoding="utf-8")
        self.assertIn("Corpo atualizado", text)
        self.assertIn("## Minha nota manual", text)
        self.assertIn("Nao apagar.", text)

    def test_filename_and_path_safety(self):
        safe = server.obsidian_safe_filename("../A/B\x00C:*?")
        self.assertNotIn("/", safe)
        self.assertNotIn("\\", safe)
        self.assertNotIn("\x00", safe)
        self.assertTrue(server.unsafe_obsidian_relpath("../bad.md"))
        self.assertTrue(server.unsafe_obsidian_relpath("/bad.md"))
        self.assertFalse(server.unsafe_obsidian_relpath("20 Notas Permanentes/Boa.md"))


if __name__ == "__main__":
    unittest.main()
