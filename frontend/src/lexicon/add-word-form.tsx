import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import type { LexiconEntry } from '../../bindings/vvalio.dev/nyelvin/lexicon';
import { useEffect, useState } from 'react';
import TagInput from '../components/tag-input';
import { usePosAndTags } from '../store';

export type AddWordFormProps = {
  existingData: LexiconEntry | null;
  onWordAdd: (word: Omit<LexiconEntry, 'id'>) => void;
  onCancel: () => void;
};

const AddWordForm: React.FC<AddWordFormProps> = ({
  existingData,
  onWordAdd,
  onCancel,
}) => {
  const [headword, setHeadword] = useState<string>(
    existingData?.headword ?? '',
  );
  const [equivalent, setEquivalent] = useState<string>(
    existingData?.equivalent ?? '',
  );

  const [tags, setTags] = useState<string[]>(existingData?.tags ?? []);
  const [canAddWord, setCanAddWord] = useState<boolean>(false);

  const [pos, setPos] = useState<string>(existingData?.pos ?? '');

  const availableGlobalTags = usePosAndTags(s => s.globalTags);
  const availablePos = usePosAndTags(s => s.partsOfSpeech);

  const handleTagSubmit = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleAddWord = () => {
    onWordAdd({
      headword,
      equivalent,
      tags,
      pos,
    });
  };

  const handleCancel = () => onCancel();

  useEffect(() => {
    if (headword.length !== 0 && equivalent.length !== 0) {
      setCanAddWord(true);
    } else {
      setCanAddWord(false);
    }
  }, [headword, equivalent]);

  return (
    <Box>
      <Box className="mb-4 mt-2">
        <Typography variant="h5">Add a word</Typography>
        <Typography variant="body1">
          Here you can add a word to your lexicon.
        </Typography>
      </Box>

      <Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Headword"
            placeholder="Leníka"
            value={headword}
            color="info"
            onChange={ev => setHeadword(ev.target.value)}
          />

          <TextField
            fullWidth
            label="Equivalent"
            placeholder="Scrumptious"
            value={equivalent}
            color="info"
            onChange={ev => setEquivalent(ev.target.value)}
          />
        </Stack>

        <Stack className="mt-8" sx={{ width: '100%' }}>
          <Typography variant="h6">Tags & POS</Typography>
          <Typography variant="body1">
            Here you can add or remove tags of your words, such as it's possible
            loan origin. You can also assign your word a part of speech, and a
            subtag for that part of speech. These can all later be used to
            change how your word behaves in inflection, for example.
          </Typography>

          <TagInput
            inputHint="Global tags"
            selectedTags={tags}
            onTagAdded={handleTagSubmit}
            onTagRemoved={(_, i) => setTags(tags.filter((v, idx) => idx !== i))}
            availableTags={availableGlobalTags}
          />

          <TagInput
            inputHint="Part of speech"
            selectedTags={pos === '' ? [] : [pos]}
            maxCount={1}
            onTagAdded={tag => setPos(tag)}
            onTagRemoved={() => setPos('')}
            availableTags={availablePos}
          />
        </Stack>

        <Grid container spacing={1} className="mt-4">
          <Grid>
            <Button
              variant="contained"
              color="info"
              onClick={handleAddWord}
              disabled={!canAddWord}
            >
              {existingData !== null ? 'Edit word' : 'Add word'}
            </Button>
          </Grid>
          <Grid>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default AddWordForm;
