cat > AGENTS.md <<'EOF'
# AGENTS.md

This project uses external system memory.

Project memory is available through:
- .ai/

Physical memory location:
- /Users/vladimir_korostelev/.ai-memory/projects/comedy.moscow/

## Read protocol

Before every task:

1. Read this file.
2. Read `.ai/MEMORY.md`.
3. Read only relevant memory files:
   - SEO, meta tags, schema.org, indexing → `.ai/SEO.md`
   - Yandex Direct, ads, landing pages → `.ai/DIRECT.md`
   - UI, layout, visual style → `.ai/STYLE.md`
   - Texts, offers, event descriptions → `.ai/CONTENT.md`
   - Commands, build, dev server, deploy → `.ai/COMMANDS.md`
   - Architecture and business decisions → `.ai/DECISIONS.md`
   - Unfinished work → `.ai/TODO.md`

Do not load all memory files unless the task clearly requires it.

## Memory update protocol

After every meaningful task, update project memory:

- Stable project fact → `.ai/MEMORY.md`
- Architecture or business decision → `.ai/DECISIONS.md`
- New command/script → `.ai/COMMANDS.md`
- SEO rule → `.ai/SEO.md`
- Advertising/landing rule → `.ai/DIRECT.md`
- UI/design rule → `.ai/STYLE.md`
- Content rule → `.ai/CONTENT.md`
- Pending/completed task → `.ai/TODO.md`
- Completed work summary → `.ai/CHANGELOG.md`

Keep memory short, factual, and dated.

Do not duplicate information.
Do not store temporary reasoning.
Do not rewrite whole files unless necessary.

## Response protocol

When done, answer briefly:

1. What changed
2. Files changed
3. Checks run
4. Memory files updated
5. Next recommended step

## Architecture memory rule

When asked to inspect or understand the project, update `.ai/MEMORY.md` with a short `Project Architecture` section.

The section should include:

- Stack
- Routing
- Main directories
- Components structure
- Styling approach
- Data/content sources
- SEO/meta/schema approach
- Redirects/rewrites
- Build/dev commands
- Important constraints

Only write facts confirmed by project files.
If something is unclear, add it to `.ai/TODO.md` instead of guessing.
EOF