import { create } from 'zustand';
import type { LexiconEntry } from '../../bindings/vvalio.dev/nyelvin/lexicon';
import { omit } from 'lodash';

export type LexiconState = {
  words: LexiconEntry[];
  addWord: (word: LexiconEntry) => void;
  editWord: (patch: Partial<LexiconEntry>) => void;
};

export const useLexicon = create<LexiconState>()(set => ({
  words: [],
  addWord: word =>
    set(state => ({
      words: [...state.words, word],
    })),
  editWord: patch =>
    set(state => ({
      words: state.words.map(w => (w.id === patch.id ? { ...w, ...patch } : w)),
    })),
}));

export const createLexiconEntryId = (): string =>
  useLexicon.getState().words.length.toString();

/**
 * Contains 3 types of tags: global tags, parts of speech, and subtags for parts of speech.
 */
export type TagsState = {
  globalTags: string[];
  partsOfSpeech: string[];
  /** key = keyof partsOfSpeech */
  posSubtags: { [key: string]: string[] };

  addGlobalTag: (tag: string) => void;
  removeGlobalTag: (tag: string) => void;

  addPos: (name: string) => void;
  removePos: (name: string) => void;

  addPosSubtag: (pos: string, tag: string) => void;
  removePosSubtag: (pos: string, tag: string) => void;
};

export const usePosAndTags = create<TagsState>()(set => ({
  globalTags: [],
  partsOfSpeech: [],
  posSubtags: {},

  addGlobalTag: tag =>
    set(state => ({
      globalTags: state.globalTags.includes(tag)
        ? state.globalTags
        : [...state.globalTags, tag],
    })),
  removeGlobalTag: tag =>
    set(state => ({
      globalTags: state.globalTags.filter(t => t !== tag),
    })),

  addPos: pos =>
    set(state => ({
      partsOfSpeech: state.partsOfSpeech.includes(pos)
        ? state.partsOfSpeech
        : [...state.partsOfSpeech, pos],
    })),
  removePos: pos =>
    set(state => ({
      partsOfSpeech: state.partsOfSpeech.filter(p => p !== pos),
      posSubtags: omit(state.posSubtags, pos),
    })),

  addPosSubtag: (pos, subtag) =>
    set(state => ({
      posSubtags: {
        ...state.posSubtags,
        [pos]:
          state.posSubtags[pos] !== undefined
            ? [...state.posSubtags[pos], subtag]
            : [subtag],
      },
    })),
  removePosSubtag: (pos, subtag) => {
    set(state => {
      const hasPos = Object.hasOwn(state.posSubtags, pos);
      if (!hasPos) {
        return state;
      }

      const posSubtags = state.posSubtags[pos];
      if (posSubtags.includes(subtag)) {
        return {
          posSubtags: {
            ...state.posSubtags,
            [pos]: posSubtags.filter(tag => {
              return tag !== subtag;
            }),
          },
        };
      }

      return state;
    });
  },
}));
