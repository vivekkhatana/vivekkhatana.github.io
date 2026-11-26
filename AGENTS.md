# Academic website project rules

This project incrementally modernizes Vivek Khatana's existing academic website at
https://vivekkhatana.github.io/. Preserve its existing architecture and visual
identity; do not rebuild it from scratch.

1. Never directly modify or push changes to `main`.
2. All development must happen on `website-redesign`.
3. Preserve an exact backup of the original website before making changes.
   The original baseline is commit
   `a9ba6728003388e8bbc1f30d842881e450e26018`, preserved by branch
   `backup/nov-2026` and annotated tag `website-v1-original`. Do not move or
   overwrite these references.
4. Make small, logical, independently reversible commits.
5. Preserve existing content, links, images, and functionality unless the user
   explicitly approves their replacement.
6. Do not change the existing color palette, typography, landing page, or sidebar
   during the initial content modernization phase. Preserve the current layout
   and visual identity.
7. Do not introduce a new framework or unnecessary dependencies.
8. Do not invent publication details, research results, URLs, or academic
   achievements.
9. Do not merge into `main` or deploy changes without the user's explicit approval.
10. Before each substantial modification, explain which files will change and why.
11. After each modification, report the changes, testing results, and relevant Git
    commit.
12. Never use force pushes, destructive Git resets, or overwrite uncommitted work.

## Safety checks

- Before making changes, inspect the current branch and working tree. If unexpected
  changes exist, stop and report them; do not discard or overwrite them.
- Before pushing a new branch or tag, inspect any existing reference with that
  name rather than overwriting it.
- Before pushing, verify that GitHub Pages publishes from `main`, or verify that
  deployment workflows cannot publish development branches. If this cannot be
  verified, stop and report the issue before pushing anything.
- Keep `main` and the original backup references unchanged throughout development.
- The current phase authorizes Git safety infrastructure and this instructions
  file only. Do not modify website source code until the user requests that work.
