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
  inputHint: string;
  selectedTags: string[];
  onTagAdded: (tag: string) => void;
  onTagRemoved: (tag: string, index: number) => void;
  availableTags?: string[];
  onSelectTag?: (tag?: string) => void;
  renderTagText?: (tag: string) => string;
  maxCount?: number;
};

/**
 * An input for variable tags that can be applied on things.
 *
 * @param inputHint passed to the placeholder property of the field
 * @param selectedTags the tags which are currently applied
 * @param onTagAdded called when a tag is added
 * @param onTagRemoved called when a tag is removed
 * @param availableTags optional parameter, when set only tags in this array are allowed
 *  and autocomplete is activated
 * @param onSelectTag optional parameter, when present allows clicking on the tags to select one at a time
 * @param renderTagText optional parameter, renders the tag's text with its name
 * @param maxCount optional parameter, defines the max count of tags
 */
const TagInput: React.FC<TagInputProps> = ({
  inputHint,
  selectedTags,
  onTagAdded,
  onTagRemoved,
  availableTags,
  onSelectTag,
  renderTagText,
  maxCount,
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
        inputHint={inputHint}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
        invalid={invalid}
        disabled={selectedTags.length === maxCount}
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
  inputHint: string;
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  invalid: boolean;
  onTagAdded: () => void;
  allowedValues?: string[];
  disabled: boolean;
};

const TagInputInternal: React.FC<TagInputInternalProps> = ({
  inputHint,
  currentTag,
  setCurrentTag,
  invalid,
  onTagAdded,
  allowedValues,
  disabled,
}) => {
  const handleKeyDown = (keyEv: React.KeyboardEvent) => {
    if (keyEv.key === 'Enter' && !invalid) {
      setCurrentTag('');
      onTagAdded();
      keyEv.preventDefault();
    }
  };

  const renderInput = (params: TextFieldProps) => (
    <TextField
      {...params}
      fullWidth
      sx={{ mt: 2 }}
      label={inputHint}
      disabled={disabled}
      color={invalid ? 'error' : 'info'}
      onKeyDown={handleKeyDown}
    />
  );

  return allowedValues ? (
    <Autocomplete
      resetHighlightOnMouseLeave
      freeSolo
      options={allowedValues}
      inputValue={currentTag}
      onInputChange={(_, newValue) => setCurrentTag(newValue)}
      onChange={(_, newValue) => {
        if (invalid) return;
        if (typeof newValue === 'string') {
          setCurrentTag(newValue);
        }
        // clear + commit on the same tick MUI resolves Enter/selection
        setCurrentTag('');
        onTagAdded();
      }}
      disabled={disabled}
      renderInput={renderInput}
    />
  ) : (
    <TextField
      fullWidth
      sx={{ mt: 2 }}
      label={inputHint}
      value={currentTag}
      disabled={disabled}
      color={invalid ? 'error' : 'info'}
      onChange={ev => setCurrentTag(ev.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default TagInput;
