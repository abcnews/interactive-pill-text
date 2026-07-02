import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { mount } from 'svelte';
import InlinePill from './components/InlinePill/InlinePill.svelte';
import type { PillConfig } from './constants';
import { selectMounts } from '@abcnews/mount-utils';
import parse from '@abcnews/alternating-case-to-object';
import { proxy } from '@abcnews/dev-proxy';

let pillConfigs: PillConfig[] = [];

function getPillConfig(text: string): PillConfig | null {
  const normalizedText = text.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
  return pillConfigs.find(config => normalizedText.includes(String(config.keyword).toLowerCase())) || null;
}

/**
 * Automatically find all <strong> tags and replace them with InlinePill components
 * if they match any pill keywords.
 */
function autoColorStrongTags() {
  const strongTags = document.querySelectorAll('strong');
  strongTags.forEach(strong => {
    const text = strong.textContent || '';
    const config = getPillConfig(text);

    if (config && strong.parentNode) {
      mount(InlinePill, {
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

const updatePills = () => {
  let changed = false;
  selectMounts('pills').forEach(pill => {
    pillConfigs.push(parse(pill.id) as unknown as PillConfig);
    changed = true;
  });
  changed && autoColorStrongTags();
};

const observer = new MutationObserver(updatePills);

// Ensure DOM is ready before running auto-replacement
Promise.all([whenOdysseyLoaded, proxy('interactive-pill-text')]).then(() => {
  const main = document.querySelector('#content');
  main &&
    observer.observe(main, {
      childList: true,
      subtree: true
    });
  updatePills();
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[interactive-pill-text] public path: ${__webpack_public_path__}`);
}
