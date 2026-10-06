# interactive-pill-text

This project automatically highlights keywords in an article when they are wrapped in `<strong>` tags. It replaces them with a Svelte component that applies user-defined colours and optionally an icon.

## How it works

The script scans for `<strong>` tags and colourises them based on the rules set by the author.

1. If the text content matches a keyword defined in a `pills` marker, it mounts the `InlineHighlights` component to replace the element with a styled "pill" representation.
1. If the text is in a decoy range with a pills config, all the strong tags will take the range value.

## Configuration

Pill configurations are dynamic and defined via markers or ranges in the article using the [ACTO format](https://github.com/abcnews/alternating-case-to-object).

e.g.

```
#pillsKEYWORDlaborCOLOURff0000
```

or

```
#startpillsCOLOURff0000
The story of <strong>Labor</strong> is one of…
#endpills
```

### Options

- **keyword** (Required): The text to match (case-insensitive).
- **text**: Foreground hex colour (lowercase, without `#`).
- **colour**: Background hex colour (lowercase, without `#`).
- **border**: Border hex colour (lowercase, without `#`).
- **icon**: (Optional) Icon identifier (4-digit year + name, e.g., `2026finger`).

### Styling Modes

The component automatically adapts its padding and layout based on the provided configuration:

#### 1. Text Only

If only a foreground text colour is specified, the pill renders as plain styled text with no extra padding.

`#pillsKEYWORDdownTEXTe01a22`

#### 2. Traditional Pill (Background)

If a background colour is provided, padding is added to create a "pill" look.

`#pillsKEYWORDdownCOLOURe01a22TEXTffffff`

#### 3. Bordered Pill

If a border color is provided, the pill uses a border with slightly adjusted padding.

`#pillsKEYWORDdownBORDERe01a22TEXTe01a22`

### Icon Resolution

Icons can be added to any of the modes above and are resolved to the following URL pattern:
`https://www.abc.net.au/res/sites/news-projects/interactive-pill-text/icons/{year}/{name}.webp`
