// @ts-nocheck
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'
import { FaChevronDown, FaDatabase, FaEye, FaPlus } from 'react-icons/fa'
// @ts-ignore
import { Link } from 'react-router-dom'
import {
  DataSourceAPI,
  BlueprintPicker,
  DataSources,
  DocumentAPI,
  JsonView,
  ApplicationContext,
} from '@dmt/common'
import useLocalStorage from '../hooks/useLocalStorage'

const documentAPI = new DocumentAPI()

const dataSourceAPI = new DataSourceAPI()

const StyledSelect = styled.select`
  font-size: large;
  margin: 0 5px 0 10px;
`

const Wrapper = styled.div`
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
      documentAPI
        .getBlueprint(attribute.getAttributeType())
        .then((result) => {
          setNestedAttributes(result.attributes)
        })
        .catch((error) => {
          NotificationManager.error(`${error.message}`)
          console.error(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {nestedAttributes.map((attr) => (
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

function FilterContainer({ search, queryError, selectedDataSource }) {
  const [filter, setFilter] = useLocalStorage('searchFilter', {})
  const [attributes, setAttributes] = useState<Array<any>>([])

  function onChange(filterChange: any) {
    setFilter({ ...filter, ...filterChange })
  }

  useEffect(() => {
    setFilter({})
  }, [selectedDataSource])

  // When the filters "type" value changes. Fetch the blueprint
  useEffect(() => {
    if (filter?.type) {
      documentAPI
        .getBlueprint(filter.type)
        .then((result) => {
          setAttributes(result.attributes)
        })
        .catch((error) => {
          NotificationManager.error(`${error.message}`)
          console.error(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.type])

  return (
    <Wrapper>
      <b>Filter</b>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          search(filter)
        }}
      >
        <Group>
          <FilterGroup>
            <label style={{ marginRight: '10px' }}>Type: </label>
            <BlueprintPicker
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
              {}
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
                {attributes.map((attribute: any) => (
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
    </Wrapper>
  )
}

// Return a TableRow for an entity. Clickable to toggle view of the raw document
function EntityRow({ entity, dataSource }: any) {
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

function ResultContainer({ result, dataSource }: any) {
  return (
    <Wrapper style={{ marginTop: '10px' }}>
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
              <EntityRow
                key={entity._id}
                entity={entity}
                dataSource={dataSource}
              />
            ))}
          </tbody>
        </table>
      </Group>
    </Wrapper>
  )
}

function SelectDataSource({
  selectedDataSource,
  setSelectedDataSource,
  dataSources,
}: any) {
  return (
    <Wrapper style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      <b>Select datasource to search:</b>
      <StyledSelect
        value={selectedDataSource}
        onChange={(event: UIEvent) => setSelectedDataSource(event.target.value)}
      >
        {dataSources.map((dataSource) => {
          return (
            <option value={dataSource.name} key={dataSource.id}>
              {dataSource.name}
            </option>
          )
        })}
      </StyledSelect>
      <FaDatabase style={{ color: 'gray', width: '20px', height: '20px' }} />
    </Wrapper>
  )
}

export default ({ settings }: any) => {
  const [result, setResult] = useState([])
  const [queryError, setQueryError] = useState('')
  const [dataSources, setDataSources] = useState<DataSources>([])
  const [selectedDataSource, setSelectedDataSource] = useLocalStorage(
    'searchDatasource',
    ''
  )

  useEffect(() => {
    dataSourceAPI
      .getAll()
      .then((dataSources: DataSources) => {
        setDataSources(dataSources)
      })
      .catch((error) => {
        console.error(error)
        NotificationManager.error(error, 'Failed to fetch datasources', 0)
      })
  }, [])

  function search(query: any) {
    if (!selectedDataSource)
      NotificationManager.warning('No datasource selected')
    documentAPI
      .search(selectedDataSource, query)
      .then((result: any) => {
        setQueryError('')
        let resultList = Object.values(result)
        if (resultList.length === 0) {
          NotificationManager.warning('No entities found', 'Search')
        } else {
          NotificationManager.success(
            `Found ${resultList.length} matching ${
              resultList.length > 1 ? 'entities' : 'entity'
            }`,
            'Search'
          )
        }
        // @ts-ignore
        setResult(resultList)
      })
      .catch((err: any) => {
        setQueryError(err.message)
        console.error(err)
      })
  }

  return (
    <>
      <SelectDataSource
        selectedDataSource={selectedDataSource}
        setSelectedDataSource={setSelectedDataSource}
        dataSources={dataSources}
      />
      <ApplicationContext.Provider
        value={{ ...settings, displayAllDataSources: true }}
      >
        <FilterContainer
          search={search}
          queryError={queryError}
          selectedDataSource={selectedDataSource}
        />
      </ApplicationContext.Provider>
      <ResultContainer result={result} dataSource={selectedDataSource} />
    </>
  )
}
