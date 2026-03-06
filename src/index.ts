import { whenDOMReady } from '@abcnews/env-utils';
import { mount } from 'svelte';
import InlineHighlights from './components/InlineHighlights/InlineHighlights.svelte';
import type { PillConfig } from './constants';
import { selectMounts } from '@abcnews/mount-utils';
import parse from '@abcnews/alternating-case-to-object';

let pillConfigs: PillConfig[] = [];

function getPillConfig(text: string): PillConfig | null {
  const normalizedText = text.toLowerCase().trim();
  return pillConfigs.find(config => normalizedText.includes(String(config.keyword).toLowerCase())) || null;
}

/**
 * Automatically find all <strong> tags and replace them with InlineHighlights components
 * if they match any pill keywords.
 */
function autoColorStrongTags() {
  const strongTags = document.querySelectorAll('strong');
  strongTags.forEach(strong => {
    const text = strong.textContent || '';
    const config = getPillConfig(text);

    if (config && strong.parentNode) {
      mount(InlineHighlights, {
        target: strong.parentNode as Element,
        anchor: strong,
        props: {
          name: text,
          colour: config.colour ? `#${config.colour}` : undefined,
          text: config.text ? `#${config.text}` : undefined,
          border: config.border ? `#${config.border}` : undefined,
          icon: config.icon
        }
      });

      strong.parentNode.removeChild(strong);
    }
  });
}

// Ensure DOM is ready before running auto-replacement
whenDOMReady.then(() => {
  pillConfigs = selectMounts('pills').map(pill => parse(pill.id) as unknown as PillConfig);
  autoColorStrongTags();
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[interactive-pill-text] public path: ${__webpack_public_path__}`);
}
