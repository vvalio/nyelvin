package project

import (
	"bytes"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"vvalio.dev/nyelvin/lexicon"
)

// Project type, contains all the data edited by the user and allows opening/saving/closing.
type Project struct {
	Lexicon *lexicon.Lexicon `json:"lexicon"`

	storeFile string `json:"-"`
}

func NewBlankProject() *Project {
	return &Project{Lexicon: lexicon.NewBlankLexicon(), storeFile: ""}
}

// LoadProject reads a project file, which is a gzip-compressed JSON document, from path.
func LoadProject(path string) (*Project, error) {
	if !filepath.IsAbs(path) {
		return nil, fmt.Errorf("file path for LoadProject must be absolute; storeFile cannot be set otherwise: %s", path)
	}

	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	gzReader, err := gzip.NewReader(file)
	if err != nil {
		return nil, fmt.Errorf("failed to decompress project file: %w", err)
	}
	defer gzReader.Close()

	content, err := io.ReadAll(gzReader)
	if err != nil {
		return nil, err
	}

	var proj Project
	err = json.Unmarshal(content, &proj)
	if err != nil {
		return nil, err
	}

	proj.storeFile = path
	return &proj, nil
}

// Save writes the project to its storeFile as a gzip-compressed JSON document.
func (p *Project) Save() error {
	if p.storeFile == "" {
		return fmt.Errorf("project storeFile not set")
	}

	data, err := json.Marshal(p)
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	gzWriter := gzip.NewWriter(&buf)
	if _, err := gzWriter.Write(data); err != nil {
		return err
	}
	if err := gzWriter.Close(); err != nil {
		return err
	}

	err = os.WriteFile(p.storeFile, buf.Bytes(), os.ModePerm.Perm())
	if err != nil {
		return err
	}

	return nil
}

func (p *Project) SaveTo(path string) error {
	if !filepath.IsAbs(path) {
		return fmt.Errorf("file path for Project/SaveTo must be absolute; storeFile cannot be set otherwise: %s", path)
	}

	p.storeFile = path
	return p.Save()
}

func (p *Project) GetLexicon() *lexicon.Lexicon {
	return p.Lexicon
}

// GetPath returns the absolute path the project was loaded from or last saved to,
// or an empty string if the project has never been saved.
func (p *Project) GetPath() string {
	return p.storeFile
}
