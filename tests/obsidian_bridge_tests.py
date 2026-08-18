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
