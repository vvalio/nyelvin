package lexicon

type Lexicon struct {
	Entries []LexiconEntry `json:"entries"`
}

func NewBlankLexicon() *Lexicon {
	return &Lexicon{Entries: make([]LexiconEntry, 0)}
}

func (l *Lexicon) GetEntries() []LexiconEntry {
	return l.Entries
}

func (l *Lexicon) AddEntry(entry LexiconEntry) {
	l.Entries = append(l.Entries, entry)
}

func (l *Lexicon) Update(other *Lexicon) error {
	l.Entries = other.Entries
	return nil
}
