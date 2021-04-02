import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BlueprintSelectorWidget from '../plugins/form-rjsf-widgets/BlueprintSelectorWidget'
import JsonView from '../components/JsonView'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'
import { FaChevronDown, FaEye, FaPlus } from 'react-icons/fa'
// @ts-ignore
import { Link } from 'react-router-dom'
import { searchAPI } from '../services/api/configs/StorageServiceAPI'
import { Application } from '../utils/variables'
import DashboardProvider, {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import IndexProvider from '../context/index/IndexProvider'
import { IndexAPI } from '../services/api/IndexAPI'
import DataSourceAPI from '../services/api/DataSourceAPI'
import { DocumentAPI } from '../services/api/DocumentAPI'

const indexAPI = new IndexAPI()
const documentAPI = new DocumentAPI()
const dataSourceAPI = new DataSourceAPI()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 20px;
`

const TypeHint = styled.div`
  align-self: flex-end;
  margin-left: 5px;
`

const AttributeName = styled.b`
  text-align: end;
  margin-right: 10px;
  padding-right: 10px;
`

const TabelData = styled.td`
  overflow: hidden;
  border: 1px solid black;
  padding: 5px;
  max-width: 50px;
`

const QueryInstructions = styled.p`
  width: min-content;
  min-width: 200px;
  margin-left: 200px;
`

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

const FilterGroup = styled.div`
  display: flex;
  padding: 5px 0;
  //justify-content: flex-start;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Collapsible = styled.div`
  display: flex;
  height: 25px;
  align-items: center;
  background-color: #d1d2d4;
  border: #878a8c 1px solid;
  cursor: pointer;
  min-width: 30px;
  padding-left: 10px;
  padding-right: 10px;

  &:hover {
    border-color: #20a0ff;
  }
`

const CollapsibleTitle = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 24px;
`

function EyeIcon() {
  return <FaEye style={{ width: '20px', height: '20px', marginLeft: '3px' }} />
}

function CollapsibleFilter({ children, title, expanded, setExpanded }: any) {
  if (expanded) {
    return (
      <>
        <Collapsible onClick={() => setExpanded(!expanded)}>
          <FaChevronDown />
          <CollapsibleTitle style={{ width: '-webkit-fill-available' }}>
            <b>{title}</b>
          </CollapsibleTitle>
        </Collapsible>
        <div style={{ padding: '10px 5px' }}>{children}</div>
      </>
    )
  } else {
    return (
      <Collapsible onClick={() => setExpanded(true)} style={{ height: '20px' }}>
        <FaPlus />
      </Collapsible>
    )
  }
}

function FetchBlueprint({ type, setValue }: any) {
  const splitType = type.split('/')
  const dataSourceId = splitType.shift()
  const path = splitType.join('/')
  // @ts-ignore
  documentAPI
    .getByPath(dataSourceId, path)
    .then((res: any) => {
      setValue(res.document.attributes)
    })
    .catch((err: any) => {
      NotificationManager.error(`${err.message}`)
      console.log(err)
    })
}

// Creates a text <input> with labels based on a BlueprintAttribute
function DynamicAttributeFilter({ value, attr, onChange }: any) {
  const attribute = new BlueprintAttribute(attr)
  const [expanded, setExpanded] = useState<boolean>(value)
  const [nestedAttributes, setNestedAttributes] = useState([])

  // Pass nested object to callback from parent
  function nestedOnChange(filterChange: any) {
    if (typeof filterChange === 'string') {
      onChange({ [attribute.getName()]: filterChange })
    } else {
      onChange({ [attribute.getName()]: { ...value, ...filterChange } })
    }
  }

  useEffect(() => {
    if (expanded && !attribute.isPrimitive()) {
      FetchBlueprint({
        type: attribute.getAttributeType(),
        setValue: setNestedAttributes,
      })
    }
  }, [expanded])

  // Don't render anything for the "type" attribute
  if (attribute.getName() === 'type') return null

  // Filter for primitive attributes
  if (attribute.isPrimitive())
    return (
      <FilterGroup>
        <AttributeName>{attribute.getPrettyName()}:</AttributeName>
        <input
          value={value || ''}
          type={'text'}
          onChange={(event: any) => {
            nestedOnChange(event.target.value)
          }}
        />
        <TypeHint>{attribute.getAttributeType()}</TypeHint>
      </FilterGroup>
    )
  // Filter for complex attributes
  return (
    <FilterGroup>
      <AttributeName>{attribute.getPrettyName()}:</AttributeName>
      <Group style={{ padding: '0px 0px' }}>
        <CollapsibleFilter
          title={attribute.getPrettyName()}
          expanded={expanded}
          setExpanded={setExpanded}
        >
          {nestedAttributes.map(attr => (
            <DynamicAttributeFilter
              // @ts-ignore
              value={value?.[attr.name]}
              // @ts-ignore
              key={attr.name}
              attr={attr}
              onChange={nestedOnChange}
            />
          ))}
        </CollapsibleFilter>
      </Group>
    </FilterGroup>
  )
}

// @ts-ignore
function FilterContainer({ search, queryError }) {
  const storedSearch = JSON.parse(localStorage.getItem('searchFilter') || '{}')
  // @ts-ignore
  const [filter, setFilter] = useState(storedSearch || {})
  const [attributes, setAttributes] = useState([])
  const dashboard: IDashboard = useDashboard()

  function onChange(filterChange: any) {
    // @ts-ignore

    setFilter({ ...filter, ...filterChange })
  }

  // When the filter changes, update the localStorage
  useEffect(() => {
    // @ts-ignore
    localStorage.setItem('searchFilter', JSON.stringify(filter))
  }, [filter])

  // When the filters "type" value changes. Fetch the blueprint
  useEffect(() => {
    if (filter?.type) {
      FetchBlueprint({ type: filter.type, setValue: setAttributes })
    }
  }, [filter?.type])

  return (
    <IndexProvider
      indexApi={indexAPI}
      documentApi={documentAPI}
      dataSources={dashboard.models.dataSources.models.dataSources}
      application={dashboard.models.application}
    >
      <Container>
        <b>Filter</b>
        <form
          onSubmit={event => {
            event.preventDefault()
            event.stopPropagation()
            search(filter)
          }}
        >
          <Group>
            <FilterGroup>
              <label style={{ marginRight: '10px' }}>Type: </label>
              <BlueprintSelectorWidget
                formData={filter?.type || ''}
                onChange={(event: any) => setFilter({ type: event })}
                uiSchema={{ 'ui:label': '' }}
              />
            </FilterGroup>
            {attributes.length !== 0 && (
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row-reverse',
                  justifyContent: 'space-between',
                  overflow: 'auto',
                }}
              >
                {/*
          // @ts-ignore */}
                <div
                  style={{
                    flexFlow: 'column',
                    width: '-webkit-fill-available',
                  }}
                >
                  <QueryInstructions>
                    Strings will be matched by case insensitive wild card
                  </QueryInstructions>
                  <QueryInstructions>
                    Numbers can be exact, or with {'">"'} and {'"<"'} operators
                  </QueryInstructions>
                  <QueryInstructions>
                    Arrays will be matched by "at least one element"
                  </QueryInstructions>
                </div>
                <div style={{ flexFlow: 'column' }}>
                  {attributes.map(attribute => (
                    <DynamicAttributeFilter
                      // @ts-ignore
                      value={filter[attribute.name]}
                      attr={attribute}
                      // @ts-ignore
                      key={attribute.name}
                      onChange={onChange}
                    />
                  ))}
                </div>
              </div>
            )}
            Query:
            <JsonView data={filter} />
            {queryError && (
              <>
                <text>Error:</text>
                <JsonView
                  data={queryError}
                  style={{ fontSize: '12px', color: 'red' }}
                />
              </>
            )}
            <ButtonContainer>
              <button
                type={'button'}
                onClick={() => {
                  setAttributes([])
                  setFilter({})
                }}
              >
                Reset
              </button>
              <button type={'submit'}>Search</button>
            </ButtonContainer>
          </Group>
        </form>
      </Container>
    </IndexProvider>
  )
}

// Return a TabelRow for an entity. Clickable to toggle view of the raw document
function EntityRow({ entity }: any) {
  const dataSource = 'entities'
  return (
    <>
      <tr>
        <TabelData>{entity.name}</TabelData>
        <TabelData>{entity.type}</TabelData>
        <TabelData>{entity.description}</TabelData>
        <TabelData>{entity._id}</TabelData>
        <td style={{ padding: '5px' }}>
          <Link to={{ pathname: `/view/${dataSource}/${entity._id}` }}>
            View
            <EyeIcon />
          </Link>
        </td>
      </tr>
    </>
  )
}

function ResultContainer({ result }: any) {
  return (
    <Container style={{ marginTop: '10px' }}>
      <b>Result</b>
      <Group>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Id</th>
              <th style={{ width: '50px' }}></th>
            </tr>

            {result.map((entity: any) => (
              <EntityRow key={entity._id} entity={entity} />
            ))}
          </tbody>
        </table>
      </Group>
    </Container>
  )
}

export default () => {
  const [result, setResult] = useState([])
  const [queryError, setQueryError] = useState('')

  function search(query: any) {
    setQueryError('')
    //TODO: Get DataSourceId from User
    searchAPI
      .searchEntities({ dataSourceId: 'entities', requestBody: query })
      .then((res: any) => {
        // @ts-ignore
        let resultList = []
        Object.keys(res).map(key => resultList.push(res[key]))
        if (resultList.length === 0) {
          NotificationManager.success('Search complete!\n No results')
        } else {
          NotificationManager.success(
            `Search complete!\n ${resultList.length} results`
          )
        }
        // @ts-ignore
        setResult(resultList)
      })
      .catch((err: any) => {
        const message =
          err?.response?.data?.detail || err?.response?.data?.message
        setQueryError(message)
        console.log(err)
      })
  }

  return (
    <DashboardProvider
      dataSourceApi={dataSourceAPI}
      application={Application.ENTITIES}
    >
      <FilterContainer search={search} queryError={queryError} />
      <ResultContainer result={result} />
    </DashboardProvider>
  )
}
