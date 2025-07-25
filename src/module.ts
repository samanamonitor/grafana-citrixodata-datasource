import { DataSourcePlugin } from '@grafana/data';
import { ODataSource } from './DataSource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { ODataQuery, ODataOptions, ODataSecureOptions } from './types';

export const plugin = new DataSourcePlugin<ODataSource, ODataQuery, ODataOptions, ODataSecureOptions>(ODataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
