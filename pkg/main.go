package main

import (
	"os"

	"github.com/samanamonitor/samm-citrixodata-datasource/pkg/plugin"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

func main() {
	if err := datasource.Manage("samm-citrixodata-datasource", plugin.NewODataSource,
		datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
