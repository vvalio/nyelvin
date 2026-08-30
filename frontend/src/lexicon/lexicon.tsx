import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AddWordForm from './add-word-form';
import { createLexiconEntryId, useLexicon } from '../store';
import type { LexiconEntry } from '../../bindings/vvalio.dev/nyelvin/lexicon';
import { useShallow } from 'zustand/shallow';

const Lexicon: React.FC = () => {
  const [isAddingWord, setIsAddingWord] = useState<boolean>(false);
  const [lexiconWords, addWordLexicon, editWordLexicon] = useLexicon(
    useShallow(s => [s.words, s.addWord, s.editWord]),
  );

  const [editedWordData, setEditedWordData] = useState<LexiconEntry | null>(
    null,
  );

  const handleOpenWordForm = () => {
    setEditedWordData(null);
    setIsAddingWord(true);
  };

  const handleAddWord = (word: Omit<LexiconEntry, 'id'>) => {
    setIsAddingWord(false);
    if (editedWordData) {
      editWordLexicon(editedWordData);
      return;
    }

    addWordLexicon({
      ...word,
      id: createLexiconEntryId(),
    });
  };

  const handleEditWord = (id: string) => {
    const editingWord = lexiconWords.find(entry => entry.id === id);
    if (!editingWord) {
      return;
    }

    setEditedWordData(editingWord);
    setIsAddingWord(true);
  };

  return isAddingWord ? (
    <AddWordForm
      onWordAdd={handleAddWord}
      existingData={editedWordData}
      onCancel={() => setIsAddingWord(false)}
    />
  ) : (
    <Box className="m-1">
      <Typography variant="h3">Lexicon</Typography>
      <Typography variant="body1">
        Here you can edit your language's lexicon, adding words and meanings.
      </Typography>

      <Box className="mt-2 mb-2">
        <Button onClick={handleOpenWordForm}>Add word</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell width={1}>ID</TableCell>
              <TableCell>Lemma</TableCell>
              <TableCell>Equivalent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lexiconWords.map((word, i) => {
              const id = word.id;
              const lemma = word.headword;
              const equivalent = word.equivalent;

              return (
                <TableRow
                  key={`lexicon-word-${i}`}
                  onClick={() => handleEditWord(id)}
                >
                  <TableCell>{id}</TableCell>
                  <TableCell>{lemma}</TableCell>
                  <TableCell>{equivalent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Lexicon;
