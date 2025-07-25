import {
  DataSourcePluginOptionsEditorProps,
  SelectableValue
} from '@grafana/data';
import {FieldSet, InlineField, InlineFieldRow, InlineFormLabel, Select, Input, LegacyForms} from '@grafana/ui';
import React, {ComponentType, useCallback} from 'react';
import {ODataOptions, URLSpaceEncoding, ODataSecureOptions} from '../types';

type Props = DataSourcePluginOptionsEditorProps<ODataOptions, ODataSecureOptions>;

export const ConfigEditor: ComponentType<Props> = ({ options, onOptionsChange }) => {
  const { secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData)
  const onResetClientSecret = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: { ...options.secureJsonFields, clientSecret: false },
      secureJsonData: { ...options.secureJsonData, clientSecret: '' },
    });
  }
  const onClientSecretChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: { ...options.secureJsonData, clientSecret: e.target.value },
    });
  }, [onOptionsChange, options]);
  const onODataPropsChange = <T extends keyof ODataOptions, V extends ODataOptions[T]>(key: T, value: V) => {
    onOptionsChange({ ...options, jsonData: { ...options.jsonData, [key]: value } });
  };
  const onURLSpaceEncodingChange = useCallback((option: SelectableValue<URLSpaceEncoding>) => {
      const urlSpaceEncoding = option.value;
      onOptionsChange({
        ...options,
        jsonData: {
          ...options.jsonData,
          urlSpaceEncoding: urlSpaceEncoding || '+',
        },
      });
  }, [onOptionsChange, options]);

  const urlSpaceEncodings = Object.entries(URLSpaceEncoding)
    .map(([label, value]) => ({ label: `${label} (${value})`, value: value }));

  return (
    <>
      <div className="gf-form-group">
        <h5 className="page-heading">Citrix Cloud</h5>
          <div className="gf-form">
            <InlineFormLabel
              width={13}
              tooltip="Citrix Cloud URL"
              >
                API URL
            </InlineFormLabel>
            <Input
              width={40}
              onChange={(v) => onODataPropsChange('citrixCloudUrl', v.currentTarget.value)}
              placeholder='https://api.cloud.com/monitorodata'
              value={options.jsonData.citrixCloudUrl}
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel
              width={13}
              tooltip="Citrix Cloud Auth URL"
              >
                Auth URL
            </InlineFormLabel>
            <Input
              width={40}
              onChange={(v) => onODataPropsChange('authUrl', v.currentTarget.value)}
              placeholder='https://api.cloud.com/cctrustoauth2/root/tokens/clients'
              value={options.jsonData.authUrl}
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel
              width={13}
              tooltip="Citrix Cloud Customer Id"
              >
                Customer Id
            </InlineFormLabel>
            <Input
              width={40}
              onChange={(v) => onODataPropsChange('customerId', v.currentTarget.value)}
              placeholder='Customer Id'
              value={options.jsonData.customerId}
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel
              width={13}
              tooltip="Citrix Cloud Client Id"
              >
                Client Id
            </InlineFormLabel>
            <Input
              width={40}
              onChange={(v) => onODataPropsChange('clientId', v.currentTarget.value)}
              placeholder='Client ID'
              value={options.jsonData.clientId}
            />
          </div>
          <div className="gf-form">
            <LegacyForms.SecretFormField
              labelWidth={13}
              inputWidth={40}
              required
              label="Client secret"
              aria-label="client secret"
              placeholder='Client secret'
              isConfigured={(secureJsonFields && secureJsonFields.clientSecret)}
              onReset={onResetClientSecret}
              onChange={onClientSecretChange}
              value={secureJsonData?.clientSecret}
            />
          </div>
      </div>
      <div className='gf-form-group'>
        <h3 className='page-heading'>Additional settings</h3>
        <FieldSet>
          <InlineFieldRow>
            <InlineField
              label='URL space encoding'
              labelWidth={26}
              tooltip={
                <p>
                  Select the standard for encoding spaces in URLs. <i>Percent</i> uses <code>%20</code> (see RFC 3986),
                  while <i>Plus</i> uses <code>+</code> (used in form data). E.g. <code>$filter=value%20EQ%201</code>
                  (Percent) and <code>`$filter=value+EQ+1`</code> (Plus).
                </p>
              }>
              <Select
                options={urlSpaceEncodings}
                value={options.jsonData.urlSpaceEncoding?.length > 0
                  ? urlSpaceEncodings.find((type) => type.value === options.jsonData.urlSpaceEncoding)
                  : URLSpaceEncoding.Plus}
                className='width-10'
                onChange={onURLSpaceEncodingChange}
              />
            </InlineField>
          </InlineFieldRow>
        </FieldSet>
      </div>
    </>
  );
};
