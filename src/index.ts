import { whenDOMReady, whenOdysseyLoaded } from '@abcnews/env-utils';
import { mount } from 'svelte';
import InlinePill from './components/InlinePill/InlinePill.svelte';
import type { PillConfig } from './constants';
import { selectMounts } from '@abcnews/mount-utils';
import parse from '@abcnews/alternating-case-to-object';
import { proxy } from '@abcnews/dev-proxy';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const RANGES = '[data-component="Decoy"][data-key="pills"][data-tag^="startpills"]';

let keywordConfigs: PillConfig[] = [];

const normalise = (text: string) => text.toLowerCase().replaceAll(/[^a-z0-9]/g, '');

function getKeywordConfig(text: string): PillConfig | null {
  const normalizedText = normalise(text);
  return keywordConfigs.find(config => normalizedText.includes(normalise(String(config.keyword)))) || null;
}

function mountPill(target: Element, anchor: Element | undefined, name: string, config: PillConfig) {
  mount(InlinePill, {
    target,
    anchor,
    props: {
      name,
      colour: config.colour ? `#${config.colour}` : undefined,
      text: config.text ? `#${config.text}` : undefined,
      border: config.border ? `#${config.border}` : undefined,
      icon: config.icon
    }
  });
}

function replaceStrong(strong: Element, config: PillConfig) {
  if (!strong.parentNode) return;
  mountPill(strong.parentNode as Element, strong, strong.textContent || '', config);
  strong.parentNode.removeChild(strong);
}

/** Colour all headings and <strong> tags inside a range wrapper with the range's config. */
function colourRanges() {
  document.querySelectorAll<HTMLElement>(RANGES).forEach(range => {
    const config = parse(range.dataset.tag || '') as unknown as PillConfig;

    range.querySelectorAll(`${HEADINGS}, strong`).forEach(el => {
      if (el.matches(HEADINGS)) {
        const text = el.textContent || '';
        if (!text.trim() || el.hasAttribute('data-pill-ranged')) return;
        el.setAttribute('data-pill-ranged', '');
        el.textContent = '';
        mountPill(el, undefined, text, config);
      } else if (!el.closest(HEADINGS)) {
        replaceStrong(el, config);
      }
    });
  });
}

/** Keyword matching for any <strong> left over after ranges have run. */
function colourKeywords() {
  if (!keywordConfigs.length) return;
  document.querySelectorAll('strong').forEach(strong => {
    const config = getKeywordConfig(strong.textContent || '');
    config && replaceStrong(strong, config);
  });
}

const updatePills = () => {
  keywordConfigs = selectMounts('pills').map(pill => parse(pill.id) as unknown as PillConfig);

  // Ranges first, so they take priority over keyword matches
  colourRanges();
  colourKeywords();
};

const observer = new MutationObserver(updatePills);

const contentLoaded = document.getElementById('pillsODYSSEYfalse') ? whenDOMReady : whenOdysseyLoaded;

// Ensure DOM is ready before running auto-replacement
Promise.all([contentLoaded, proxy('interactive-pill-text')]).then(() => {
  const main = document.querySelector('#content');
  main &&
    observer.observe(main, {
      childList: true,
      subtree: true
    });
  updatePills();
});
