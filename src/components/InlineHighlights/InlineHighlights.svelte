<script lang="ts">
  import FireFont from '../FireFont/FireFont.svelte';

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
</script>

<span
  class="inline-highlight"
  class:inline-highlight--with-icon={iconUrl}
  class:inline-highlight--with-border={border}
  class:inline-highlight--minimal={!border && !colour}
  style:--bgColour={colour}
  style:--fgColour={text}
  style:--borderColour={border}
>
  {#if iconUrl}
    <img src={iconUrl} alt="" class="inline-highlight__icon" />
  {/if}
  <FireFont>{name}</FireFont>
</span>

<style lang="scss">
  .inline-highlight {
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

    &--with-border {
      border: 2px solid var(--borderColour, transparent);
      padding: 1px 4px;
    }
    &--minimal {
      padding: 0;
    }
    &--with-icon {
      padding-right: calc(4px + 16px + 2px);
    }

    .inline-highlight__icon {
      width: 16px;
      height: 16px;
      object-fit: contain;
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
