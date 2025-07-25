# Grafana Samm Citrix Cloud Data Source
Visualize data from Citrix Cloud data source with Grafana.

## About
This is a Grafana data source for showing data from CitrixCloud data source.

## Getting started
Open Grafana and go to Configuration / Data Sources. Click `Add data source` button.

Enter `CitrixCloud` into the filter input field and select the CitrixCloud Data Source.

![Add Data Source](https://raw.githubusercontent.com/samanamonitor/samm-citrixodata-datasource/master/src/img/AddDataSource.png)

Provide the URL of Citrix Cloud Service Root, credentials and click `Save & test` to test the connection.

The `URL space encoding` setting can be used to specify the encoding of spaces in URLs. `Percent` uses `%20` (see RFC
3986), while `Plus` uses `+` (used in form data). E.g. `$filter=value%20EQ%201` vs. `$filter=value+EQ+1`.

To use the data source, create a new query and select the newly created CitrixCloud data source.

![CreateQuery.png](https://raw.githubusercontent.com/samanamonitor/samm-citrixodata-datasource/master/src/img/CreateQuery.png)

Choose an entity set, an appropriate time property, and the metric you want to view.
Now you should be able to see data for the selected time frame.

## Related Links
* [Grafana](https://grafana.com) - the open source analytics & monitoring solution for many data sources
* [Build a Grafana data source plugin](https://grafana.com/tutorials/build-a-data-source-plugin/) - a tutorial that 
  explains how to develop your own data source plugin.
* [OData](https://www.odata.org) - the ISO/IEC approved, OASIS standard for building and using data-driven RESTful APIs
* [Citrix](https://developer-docs.citrix.com/en-us/monitor-service-odata-api/) - Citrix Cloud OData Monitoring APIs

## Contributing
This project has been created based on d-velop's work on OData plugin.
The OData plugin project is maintained by d-velop but is looking for contributors. If you consider contributing to this project
please read [CONTRIBUTING](https://raw.githubusercontent.com/d-velop/grafana-odata-datasource/master/CONTRIBUTING.md)
and [DEVELOPING](https://raw.githubusercontent.com/d-velop/grafana-odata-datasource/master/DEVELOPING.md) for details on
how to get started.

## License
Please read [LICENSE](https://raw.githubusercontent.com/d-velop/grafana-odata-datasource/master/LICENSE) for licensing
information.
