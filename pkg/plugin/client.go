package plugin

import (
	"fmt"
	"net/http"
	"net/url"
	"path"
	"strings"
	"encoding/json"
	"io"
	"time"
	"strconv"

	"github.com/samanamonitor/samm-citrixodata-datasource/pkg/plugin/odata"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type ODataClient interface {
	GetServiceRoot() (*http.Response, error)
	GetMetadata() (*http.Response, error)
	Get(entitySet string, properties []property,
		filterConditions []filterCondition, count bool) (*http.Response, error)
}

type ODataClientImpl struct {
	httpClient       *http.Client
	baseUrl          string
	urlSpaceEncoding string
	customerId       string
}


type ErrorMessage struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func (client *ODataClientImpl) get(url string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Citrix-CustomerId", client.customerId)
	var res *http.Response
	for retries := 0; retries < 3; retries++ {
		res, err = client.httpClient.Do(req)
		if err != nil {
			return nil, err
		}
		if res.StatusCode == 200 {
			return res, nil
		}
		if res.StatusCode == 500 {
			return res, nil
		}

		defer res.Body.Close()
		var edata ErrorMessage
		var body []byte
		body, err = io.ReadAll(res.Body)
		if err != nil {
			return res, err
		}
		err = json.Unmarshal(body, &edata)
		if err != nil {
			return res, err
		}
		if edata.StatusCode == 429 {
			time.Sleep(time.Duration(time.Now().UnixNano() % 5000) * time.Millisecond)
			continue
		}
		return res, fmt.Errorf("Error (%d) %s", edata.StatusCode, edata.Message)
	}
	return res, err

}

func (client *ODataClientImpl) GetServiceRoot() (*http.Response, error) {
	return client.get(client.baseUrl)
}

func (client *ODataClientImpl) GetMetadata() (*http.Response, error) {
	requestUrl, err := url.Parse(client.baseUrl)
	if err != nil {
		return nil, err
	}
	requestUrl.Path = path.Join(requestUrl.Path, odata.Metadata)
	return client.get(requestUrl.String())
}

func (client *ODataClientImpl) Get(entitySet string, properties []property, filterConditions []filterCondition, count bool) (*http.Response, error) {
	requestUrl, err := buildQueryUrl(client.baseUrl, entitySet, properties,
		filterConditions, count, client.urlSpaceEncoding)
	if err != nil {
		return nil, err
	}
	urlString := requestUrl.String()
	log.DefaultLogger.Debug("Constructed request url: ", urlString)
	return client.get(urlString)
}

func buildQueryUrl(baseUrl string, entitySet string, properties []property, filterConditions []filterCondition, count bool, urlSpaceEncoding string) (*url.URL, error) {
	requestUrl, err := url.Parse(baseUrl)
	if err != nil {
		return nil, err
	}
	requestUrl.Path = path.Join(requestUrl.Path, entitySet)
	params, _ := url.ParseQuery(requestUrl.RawQuery)
	if count {
		params.Add(odata.Count, strconv.FormatBool(count))
		params.Add(odata.Top, "0")
	}
	filterParam := mapFilter(filterConditions)
	if len(filterParam) > 0 {
		params.Add(odata.Filter, filterParam)
	}
	selectParam := mapSelect(properties)
	if len(selectParam) > 0 {
		params.Add(odata.Select, selectParam)
	}
	encodedUrl := params.Encode()
	if urlSpaceEncoding == "%20" {
		encodedUrl = strings.ReplaceAll(encodedUrl, "+", "%20")
	}
	requestUrl.RawQuery = encodedUrl
	return requestUrl, nil
}

func mapSelect(properties []property) string {
	var result []string
	if len(properties) > 0 {
		for _, selectProp := range properties {
			result = append(result, selectProp.Name)
		}
	}
	return strings.Join(result[:], ",")
}

func mapFilter(filterConditions []filterCondition) string {
	var filter = ""
	for index, element := range filterConditions {
		if element.Operator == "eq null" || element.Operator == "ne null" {
			filter += fmt.Sprintf("%s %s", element.Property.Name, element.Operator)
		} else if element.Property.Type == odata.EdmString {
			filter += fmt.Sprintf("%s %s '%s'", element.Property.Name, element.Operator, element.Value)
		} else {
			filter += fmt.Sprintf("%s %s %s", element.Property.Name, element.Operator, element.Value)
		}
		if index < (len(filterConditions) - 1) {
			filter += " and "
		}
	}

	return filter
}
