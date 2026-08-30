package service

import (
	"fmt"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
	"vvalio.dev/nyelvin/project"
)

// Event names emitted by ProjectService.
const (
	EventProjectOpen  = "project:open"
	EventProjectSave  = "project:save"
	EventProjectClose = "project:close"
)

// ProjectOpenEventData is emitted whenever a project becomes the current project,
// whether freshly created or loaded from disk.
type ProjectOpenEventData struct {
	Path    string           `json:"path"`
	Project *project.Project `json:"project"`
}

// ProjectSaveEventData is emitted whenever the current project is saved to disk.
type ProjectSaveEventData struct {
	Path string `json:"path"`
}

const projectFileFilterName = "Nyelvin projects"
const projectFileFilterPattern = "*.nyelv"

// ProjectService owns the currently open project and drives opening, saving,
// and closing it, including the native file dialogs involved.
type ProjectService struct {
	project *project.Project
}

func NewProjectService(proj *project.Project) *ProjectService {
	return &ProjectService{project: proj}
}

func NewBlankProjectService() *ProjectService {
	return NewProjectService(project.NewBlankProject())
}

func (p *ProjectService) GetProject() *project.Project {
	return p.project
}

// GetProjectPath returns the path of the current project's file, or an empty
// string if it has never been saved.
func (p *ProjectService) GetProjectPath() string {
	if p.project == nil {
		return ""
	}

	return p.project.GetPath()
}

// OpenProject prompts the user to pick a project file, loads it and makes it
// the current project. Returns nil, nil if the user cancels the dialog.
func (p *ProjectService) OpenProject() (*project.Project, error) {
	path, err := application.Get().Dialog.OpenFile().
		SetTitle("Open Project").
		AddFilter(projectFileFilterName, projectFileFilterPattern).
		AddFilter("All files", "*.*").
		PromptForSingleSelection()
	if err != nil {
		return nil, err
	}
	if path == "" {
		return nil, nil
	}

	if !filepath.IsAbs(path) {
		return nil, fmt.Errorf("path returned by open dialog was not absolute: %s", path)
	}

	proj, err := project.LoadProject(path)
	if err != nil {
		return nil, err
	}

	p.project = proj
	application.Get().Event.Emit(EventProjectOpen, &ProjectOpenEventData{Path: path, Project: p.project})
	return p.project, nil
}

// SaveProject saves the current project to disk, prompting for a location
// via SaveProjectAs if it doesn't have one yet.
func (p *ProjectService) SaveProject() error {
	if p.project == nil {
		return fmt.Errorf("no project is currently open")
	}

	if p.project.GetPath() == "" {
		return p.SaveProjectAs()
	}

	if err := p.project.Save(); err != nil {
		return err
	}

	application.Get().Event.Emit(EventProjectSave, &ProjectSaveEventData{Path: p.project.GetPath()})
	return nil
}

// SaveProjectAs prompts the user for a location and saves the current project
// there, making it the project's file going forward. No-ops if the user
// cancels the dialog.
func (p *ProjectService) SaveProjectAs() error {
	if p.project == nil {
		return fmt.Errorf("no project is currently open")
	}

	path, err := application.Get().Dialog.SaveFile().
		SetMessage("Save Project As").
		AddFilter(projectFileFilterName, projectFileFilterPattern).
		SetFilename("project.nyelv").
		PromptForSingleSelection()
	if err != nil {
		return err
	}
	if path == "" {
		return nil
	}

	if !filepath.IsAbs(path) {
		return fmt.Errorf("path returned by save dialog was not absolute: %s", path)
	}

	if err := p.project.SaveTo(path); err != nil {
		return err
	}

	application.Get().Event.Emit(EventProjectSave, &ProjectSaveEventData{Path: path})
	return nil
}

// Called from the UI to update te project object.
func (p *ProjectService) Update(source *project.Project) error {
	if source.Lexicon != nil {
		if err := p.project.Lexicon.Update(source.Lexicon); err != nil {
			return err
		}
	}

	return nil
}

// CloseProject closes the current project, replacing it with a blank one.
func (p *ProjectService) CloseProject() {
	p.project = project.NewBlankProject()
	application.Get().Event.Emit(EventProjectClose, struct{}{})
}
