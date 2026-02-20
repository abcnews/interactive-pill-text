<script lang="ts">
  import FireFont from '../FireFont/FireFont.svelte';

  interface Props {
    /** The text to display inside the pill */
    name: string;
    /** Background colour (css hex or name) */
    bg?: string;
    /** Foreground colour (css hex or name) */
    fg?: string;
    /** Icon name, prefixed with 4-digit year (e.g. 2026finger) */
    icon?: string;
  }

  let { name, bg, fg, icon }: Props = $props();

  const iconUrl = $derived.by(() => {
    if (!icon) return null;
    const year = icon.substring(0, 4);
    const name = icon.substring(4);
    return `https://www.abc.net.au/res/sites/news-projects/interactive-pill-text/icons/${year}/${name}.webp`;
  });
</script>

<span class="inline-highlight" class:inline-highlight--with-icon={iconUrl} style:--bg={bg} style:--fg={fg}>
  {#if iconUrl}
    <img src={iconUrl} alt="" class="inline-highlight__icon" />
  {/if}
  <FireFont>{name}</FireFont>
</span>

<style lang="scss">
  .inline-highlight {
    display: inline-flex;
    padding: 0rem 0.375rem;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-radius: 0.25rem;
    background: var(--bg, #f1f1f1);
    color: var(--fg, black);
    font-family: ABCSans, sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    overflow: hidden;
    position: relative;
    border: none;
    gap: 0.25rem;

    &--with-icon {
      padding-right: calc(1.5rem + 0.2rem);
    }

    // Fallback if no bg color found
    &:not([style*='--bg']) {
      background: #f1f1f1;
      color: black;
      border: 1px solid black;
    }

    .inline-highlight__icon {
      width: 1.25rem;
      height: calc(100% - 0.2rem);
      object-fit: contain;
      position: absolute;
      right: 0.2rem;
      top: 0.1rem;
    }
  }
</style>
