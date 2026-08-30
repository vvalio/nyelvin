package main

import (
	"embed"
	"os"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
	"vvalio.dev/nyelvin/service"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// for linux diacritic functionality
	os.Setenv("GTK_IM_MODULE", "simple")

	projectService := service.NewBlankProjectService()

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "nyelvin",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(projectService),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	appMenu := createMenu(app, projectService)

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window 1",
		// Window sized to the golden ratio (1000 / 618 ≈ 1.618).
		Width:  1000,
		Height: 618,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(6, 7, 15),
		URL:              "/",
		Linux: application.LinuxWindow{
			Menu: appMenu,
		},
		Windows: application.WindowsWindow{
			Menu: appMenu,
		},
	})

	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}

func createMenu(app *application.App, projectService *service.ProjectService) *application.Menu {
	menu := app.NewMenu()
	fileMenu := menu.AddSubmenu("File")

	openItem := fileMenu.Add("Open")
	openItem.OnClick(func(ctx *application.Context) {
		if _, err := projectService.OpenProject(); err != nil {
			log.Printf("Project failed to open: %s\n", err)
		}
	})

	saveItem := fileMenu.Add("Save")
	saveItem.OnClick(func(ctx *application.Context) {
		if err := projectService.SaveProject(); err != nil {
			log.Printf("Project failed to save: %s\n", err)
		}
	})

	saveAsItem := fileMenu.Add("Save as")
	saveAsItem.OnClick(func(ctx *application.Context) {
		if err := projectService.SaveProjectAs(); err != nil {
			log.Printf("Project failed to save: %s\n", err)
		}
	})

	closeItem := fileMenu.Add("Close")
	closeItem.OnClick(func(ctx *application.Context) {
		projectService.CloseProject()
	})

	return menu
}
