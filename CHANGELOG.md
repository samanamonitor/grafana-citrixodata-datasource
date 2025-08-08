# Change Log

## [1.1.3] 2025-08-08

### Features
- Fix bug when updating filters. The values would not change when using the "recording rule" or alert features
- Added default values for CitrixCloudUrl and AuthUrl
- Added "time" field for "count" function

## [1.1.2] 2025-07-25

### Features
- Added OAuth authentication compatible with Citrix Cloud [Authentication](https://developer-docs.citrix.com/en-us/citrix-cloud/accessing-monitor-service-data-citrix-cloud-external/accessing-monitor-service-data-citrix-cloud-external.html)
- Added the ability to count records instead of returning data
- Added the operators 'eq null' and 'ne null' to the filters


## [1.1.1] 2025-04-17

### Features
- Updated to go version `1.24`
- Updated to Grafana `11.6`

## [1.1.0] 2024-03-14

### Features
- [#2](https://github.com/d-velop/grafana-odata-datasource/issues/2): Made time property optional
- Updated to go version `1.21`
- Updated to Grafana `10.2`
- Configurable space encoding (`%20`or `+`)

## [1.0.0] 2023-05-12

### Features
- Initial revision
