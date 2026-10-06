<script lang="ts">
  interface Props {
    /** The text to display inside the pill */
    name: string;
    /** Background colour (css hex or name) */
    colour?: string;
    /** Foreground colour (css hex or name) */
    text?: string;
    /** Border colour (css hex or name) */
    border?: string;
    /** Icon name, prefixed with 4-digit year (e.g. 2026finger) */
    icon?: string;
  }

  let { name, colour, text, border, icon }: Props = $props();

  const iconUrl = $derived.by(() => {
    if (!icon) return null;
    const year = icon.substring(0, 4);
    let name = icon.substring(4);
    let extension = 'webp';

    if (name.endsWith('svg')) {
      extension = 'svg';
      name = name.slice(0, -3);
    }

    return `https://www.abc.net.au/res/sites/news-projects/interactive-pill-text/icons/${year}/${name}.${extension}`;
  });

  let isMinimal = $derived(!border && !colour);
  let shouldWrap = $derived(name.length > 45);
</script>

<span class="inline-pill-wrapper" class:inline-pill-wrapper--active={!isMinimal}>
  <span
    class="inline-pill"
    class:inline-pill--with-icon={iconUrl}
    class:inline-pill--with-border={border}
    class:inline-pill--minimal={isMinimal}
    class:inline-pill--wrappable={shouldWrap}
    style:--bgColour={colour}
    style:--fgColour={text}
    style:--borderColour={border}
  >
    {#if iconUrl}
      <img src={iconUrl} alt="" class="inline-pill__icon" />
    {/if}
    <span class="inline-pill__text" class:inline-pill__text--active={!isMinimal}>
      {name}
    </span>
  </span>
</span>

<style>
  /* ==========================================================================
   Inline pill wrapper
   ========================================================================== */

  .inline-pill-wrapper {
    /* revert inherited changes from .u-quote blocks in Firefox */
    text-indent: 0;
  }

  /* Firefox-only: translate the whole pill UP.
   Requires display: inline-block to apply transform. */
  @supports (image-rendering: -moz-crisp-edges) {
    .inline-pill-wrapper--active {
      display: inline-block;
      translate: 0 -1px;
    }
  }

  /* ==========================================================================
   Inline pill
   ========================================================================== */

  .inline-pill {
    position: relative;
    color: var(--fgColour, black);
    background: var(--bgColour, transparent);
    border-radius: 4px;
    font-family: ABCSans;
    font-size: 0.9em;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    padding: 3px 4px;
    white-space: nowrap;
  }

  /* Modifiers */

  .inline-pill--with-border {
    border: 2px solid var(--borderColour, transparent);
    padding: 1px 4px;
  }
  .inline-pill--wrappable {
    white-space: unset;
  }

  .inline-pill--minimal {
    font-size: 1em;
    padding: 0;
  }

  .inline-pill--with-icon {
    padding-right: calc(4px + 16px + 2px);
  }

  /* Firefox-only: translate the text DOWN within the pill to center it.
   Requires display: inline-block to apply transform. */
  @supports (image-rendering: -moz-crisp-edges) {
    .inline-pill__text--active {
      display: inline-block;
      translate: 0 1px;
    }
  }

  .inline-pill__icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
