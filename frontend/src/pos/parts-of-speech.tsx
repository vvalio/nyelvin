import { Box, Typography } from '@mui/material';
import TagInput from '../components/tag-input';
import { usePosAndTags } from '../store';
import { useShallow } from 'zustand/shallow';
import { useState } from 'react';

export type PartsOfSpeechProps = {};

/**
 * Views and allows editing parts of speech, global tags, and POS subtags.
 */
const PartsOfSpeech: React.FC<PartsOfSpeechProps> = ({}) => {
  const [globalTags, addGlobalTag, removeGlobalTag] = usePosAndTags(
    useShallow(s => [s.globalTags, s.addGlobalTag, s.removeGlobalTag]),
  );

  const [partsOfSpeech, addPos, removePos] = usePosAndTags(
    useShallow(s => [s.partsOfSpeech, s.addPos, s.removePos]),
  );

  const [posSubtags, addPosSubtag, removePosSubtag] = usePosAndTags(
    useShallow(s => [s.posSubtags, s.addPosSubtag, s.removePosSubtag]),
  );
  const [subtaggedPos, setSubtaggedPos] = useState<string | undefined>(
    undefined,
  );

  return (
    <Box className="m-1">
      <Typography variant="h3">Tags</Typography>
      <Typography variant="body1">
        Edit below global tags that can be applied on lexicon entries.
      </Typography>

      <TagInput
        inputHint="Global tag name"
        selectedTags={globalTags}
        onTagAdded={addGlobalTag}
        onTagRemoved={removeGlobalTag}
      />

      <Box className="mt-4">
        <Typography variant="h3">Parts of speech</Typography>
        <Typography variant="body1">
          Below you can edit the parts of speech that can also be applied on
          lexicon entries.
        </Typography>

        <TagInput
          inputHint="Part of speech"
          selectedTags={partsOfSpeech}
          onTagAdded={pos => addPos(pos)}
          onTagRemoved={pos => removePos(pos)}
          onSelectTag={tag => setSubtaggedPos(tag)}
        />

        <Box className="mt-2">
          <Typography variant="body1">
            You can also add subtags for parts of speech. These can be used for
            further specification of the word type: if you have a POS 'Verb',
            you can add 'Verb/irregular', 'Verb/third declension', etc. Click on
            a tag to select it, then add a subtag.
          </Typography>

          {subtaggedPos ? (
            <TagInput
              inputHint="Subtag name"
              selectedTags={posSubtags[subtaggedPos] ?? []}
              onTagAdded={tag => addPosSubtag(subtaggedPos, tag)}
              onTagRemoved={tag => removePosSubtag(subtaggedPos, tag)}
              renderTagText={tag => `${subtaggedPos}/${tag}`}
            />
          ) : undefined}
        </Box>
      </Box>
    </Box>
  );
};

export default PartsOfSpeech;
