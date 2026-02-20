# interactive-pill-text

This project automatically highlights keywords in an article when they are wrapped in `<strong>` tags. It replaces them with a Svelte component that applies user-defined colours and optionally an icon.

## How it works

The script scans the DOM for all `<strong>` tags. If the text content matches a keyword defined in a Scrollyteller `pills` mount, it mounts the `InlineHighlights` component to replace the element with a styled "pill" representation.

## Configuration

Pill configurations are dynamic and defined via Scrollyteller mounts in the article.

### Example Mount:

`#pillsKEYWORDdownCOLOURe01a22TEXTffffffICON2026finger`

- **keyword**: The text to match (case-insensitive).
- **colour**: The background hex colour (without #).
- **text**: The foreground hex colour (without #).
- **icon**: (Optional) Icon identifier (4-digit year + name, e.g., `2026finger`).

## Icon Resolution

Icons are resolved to the following URL pattern:
`https://www.abc.net.au/res/sites/news-projects/interactive-pill-text/icons/{year}/{name}.webp`
