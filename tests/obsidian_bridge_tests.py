import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


FIXED = "2026-08-18T00:00:00Z"


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
        with tempfile.TemporaryDirectory() as tmp:
            vault = Path(tmp)
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
