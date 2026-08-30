import {
  Stack,
  TextField,
  Grid,
  Chip,
  Autocomplete,
  type TextFieldProps,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SlMinus } from 'react-icons/sl';

export type TagInputProps = {
  selectedTags: string[];
  onTagAdded: (tag: string) => void;
  onTagRemoved: (tag: string, index: number) => void;
  availableTags?: string[];
  onSelectTag?: (tag?: string) => void;
  renderTagText?: (tag: string) => string;
};

/**
 * An input for variable tags that can be applied on things.
 *
 * @param selectedTags the tags which are currently applied
 * @param onTagAdded called when a tag is added
 * @param onTagRemoved called when a tag is removed
 * @param availableTags optional parameter, when set only tags in this array are allowed
 *  and autocomplete is activated
 * @param onSelectTag optional parameter, when present allows clicking on the tags to select one at a time
 * @param renderTagText optional parameter, renders the tag's text with its name
 */
const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onTagAdded,
  onTagRemoved,
  availableTags,
  onSelectTag,
  renderTagText,
}) => {
  // the current input value
  const [currentTag, setCurrentTag] = useState<string>('');
  // is the tag invalid
  const [invalid, setInvalid] = useState<boolean>(true);

  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedTag) {
      onSelectTag?.(selectedTag);
    } else {
      onSelectTag?.(undefined);
    }
  }, [selectedTag]);

  useEffect(() => {
    if (currentTag.trim() === '') {
      setInvalid(true);
    } else {
      if (availableTags && !availableTags.includes(currentTag)) {
        setInvalid(true);
      } else {
        setInvalid(false);
      }
    }
  }, [currentTag]);

  return (
    <Stack sx={{ width: '100%' }}>
      <TagInputInternal
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
        invalid={invalid}
        onTagAdded={() => {
          onTagAdded(renderTagText ? renderTagText(currentTag) : currentTag);
        }}
        allowedValues={availableTags}
      />

      <Grid container spacing={1} className="mt-2">
        {selectedTags.map((tag, i) => {
          return (
            <Grid>
              <Chip
                key={`tag-${i}`}
                variant="filled"
                label={tag}
                deleteIcon={<SlMinus />}
                onDelete={() => onTagRemoved(tag, i)}
                onClick={
                  onSelectTag
                    ? () =>
                        tag !== selectedTag
                          ? setSelectedTag(tag)
                          : setSelectedTag(undefined)
                    : undefined
                }
                sx={{
                  border: selectedTag === tag ? '1px solid black' : 'unset',
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

type TagInputInternalProps = {
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  invalid: boolean;
  onTagAdded: () => void;
  allowedValues?: string[];
};

const TagInputInternal: React.FC<TagInputInternalProps> = ({
  currentTag,
  setCurrentTag,
  invalid,
  onTagAdded,
  allowedValues,
}) => {
  const unwrappedInput = (props: TextFieldProps) => (
    <TextField
      {...props}
      fullWidth
      sx={{ mt: 2 }}
      label="Enter tag"
      placeholder="Noun"
      value={currentTag}
      onChange={ev => setCurrentTag(ev.target.value)}
      color={invalid ? 'error' : 'info'}
      onKeyDown={keyEv => {
        if (keyEv.key === 'Enter' && !invalid) {
          setCurrentTag('');
          onTagAdded();
          keyEv.preventDefault();

          return;
        }
      }}
    />
  );

  return allowedValues ? (
    <Autocomplete
      resetHighlightOnMouseLeave
      options={allowedValues}
      renderInput={unwrappedInput}
    />
  ) : (
    unwrappedInput({})
  );
};

export default TagInput;
