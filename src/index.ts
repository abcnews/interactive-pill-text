import { whenDOMReady } from '@abcnews/env-utils';
import { mount } from 'svelte';
import InlineHighlights from './components/InlineHighlights/InlineHighlights.svelte';
import type { PillConfig } from './constants';
import { selectMounts } from '@abcnews/mount-utils';
import parse from '@abcnews/alternating-case-to-object';

let pillConfigs: PillConfig[] = [];

function getPillConfig(text: string): PillConfig | null {
  const normalizedText = text.toLowerCase().trim();
  return pillConfigs.find(config => normalizedText.includes(config.keyword.toLowerCase())) || null;
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

    if (config) {
      const wrapper = document.createElement('span');
      strong.parentNode?.replaceChild(wrapper, strong);

      mount(InlineHighlights, {
        target: wrapper,
        props: {
          name: text,
          colour: `#${config.colour}`,
          text: `#${config.text}`,
          border: `#${config.border}`,
          icon: config.icon
        }
      });
    }
  });
}

// Ensure DOM is ready before running auto-replacement
whenDOMReady.then(() => {
  pillConfigs = selectMounts('pills').map(pill => parse(pill.id) as unknown as PillConfig);
  console.log({ pills: pillConfigs });

  autoColorStrongTags();
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[interactive-pill-text] public path: ${__webpack_public_path__}`);
}
