# Starter Curriculum V1

Fetched at: 2026-08-17

Version: `STARTER_CURRICULUM_VERSION = 1`

## Scope

- 17 starter courses now receive official Course -> Module -> Lesson structures where the provider exposes lesson-level data.
- Starter curriculum records carry `starterManaged`, `curriculumSource`, `curriculumSourceUrl`, `curriculumFetchedAt`, and `curriculumVersion`.
- The migration is idempotent through `applyStarterCurriculumV1(state)`.
- User progress, status, notes, vault links, focus drafts, dates, priority flags, custom metadata, and user-created modules are preserved.

## Specializations

- `course-elec-04` is represented as `programType: "specialization"` with `childCourseIds` for the two starter child courses already in the catalog:
  `course-elec-02`, `course-elec-03`.
- The non-starter child courses are kept in `childCourses`, avoiding duplicated starter courses.
- `course-elec-10` uses the same specialization-style child course structure for the VLSI series.

## Sources

- Personal & Family Financial Planning: https://www.coursera.org/learn/family-planning
- Financial Markets: https://www.coursera.org/learn/financial-markets-global
- Understanding Financial Markets: https://www.coursera.org/learn/understanding-financial-markets
- Meeting Investors' Goals: https://www.coursera.org/learn/meeting-investors-goals
- Portfolio and Risk Management: https://www.coursera.org/learn/portfolio-risk-management
- Securing Investment Returns in the Long Run: https://www.coursera.org/learn/investment-returns-long-run
- Fundamentals of Finance: https://www.coursera.org/learn/finance-fundamentals
- Microcontrollers: https://www.coursera.org/learn/microcontrollers-basic-architecture-and-design
- Intro to FPGA Design: https://www.coursera.org/learn/intro-fpga-design-embedded-systems
- FPGA Hardware Description Languages: https://www.coursera.org/learn/fpga-hardware-description-languages
- FPGA Design for Embedded Systems Specialization: https://www.coursera.org/specializations/fpga-design
- Computer Architecture: https://www.coursera.org/learn/comparch
- Introduction to RISC-V: https://training.linuxfoundation.org/training/introduction-to-riscv-lfd110/
- Building a RISC-V CPU Core: https://training.linuxfoundation.org/training/building-a-riscv-cpu-core-lfd111x/
- SystemVerilog Tutorials: https://www.coursera.org/learn/systemverilog-tutorials-hardware-design--verification
- Introduction to the UVM: https://verificationacademy.com/topics/uvm-universal-verification-methodology/introduction-to-the-uvm/
- Chip Based VLSI Design for Industrial Applications: https://www.coursera.org/specializations/chip-based-vlsi-design-for-industrial-applications

## UI Behavior

- Course rows expand into official modules and lessons.
- Focus, notes, and fichamentos work at course, module, and lesson scope.
- Daily planning selects the next unfinished module or lesson instead of only the parent course.
- Module progress derives from lessons when lessons exist; course progress derives from modules.
- Specialization progress derives from referenced child courses and child course records.

## Verification

- Static/runtime tests cover fresh seed, existing profile merge, idempotent rerun, preservation of user fields, stable ids, specialization references, daily plan targets, and navigation for module/lesson resources.
