package lexicon

// Lexicon entry defines a word, its meanings and other data
type LexiconEntry struct {
	// ID of the word
	ID string `json:"id"`
	// the headword (usually in english)
	Headword string `json:"headword"`
	// one equivalent for now
	Equivalent string `json:"equivalent"`
	// tag list
	Tags []string `json:"tags"`
	// part of speech
	Pos string `json:"pos"`
}
