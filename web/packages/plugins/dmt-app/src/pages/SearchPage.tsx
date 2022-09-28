import React, { useContext, ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'
import { FaChevronDown, FaDatabase, FaEye, FaPlus } from 'react-icons/fa'
import { Autocomplete, AutocompleteChanges } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'

import { Link } from 'react-router-dom'
import {
  DmssAPI,
  BlueprintPicker,
  TDataSources,
  JsonView,
  ApplicationContext,
  AuthContext,
  useLocalStorage,
  TDataSource,
  TGenericObject,
  TAttribute,
  DataSourceInformation,
} from '@development-framework/dm-core'

const DEFAULT_SORT_BY_ATTRIBUTE = 'name'

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

function CollapsibleFilter({
  children,
  title,
  expanded,
  setExpanded,
}: {
  children: React.ReactNode
  title: string
  expanded: boolean
  setExpanded: (newValue: boolean) => void
}) {
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

// Creates a text <input> for the sortByAttribute
function SortByAttribute({
  sortByAttribute,
  setSortByAttribute,
}: {
  sortByAttribute: string
  setSortByAttribute: (newAttribute: string) => void
}) {
  return (
    <FilterGroup>
      <AttributeName>Sort by:</AttributeName>
      <input
        style={{ maxHeight: '30px' }}
        key="sortByAttribute"
        value={sortByAttribute}
        type={'text'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSortByAttribute(event.target.value)
        }}
      />
      <QueryInstructions>
        Dotted attribute path, starting at the root. E.g "name",
        "childEntity.date", or "childListEntity.3.height"
      </QueryInstructions>
    </FilterGroup>
  )
}

// Creates a text <input> with labels based on a BlueprintAttribute
function DynamicAttributeFilter({
  value,
  attr,
  onChange,
}: {
  value: string | TGenericObject | undefined
  attr: TAttribute
  onChange: (newValue: TGenericObject) => void
}) {
  const attribute = new BlueprintAttribute(attr)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [nestedAttributes, setNestedAttributes] = useState<TAttribute[]>([])
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  // Pass nested object to callback from parent
  function nestedOnChange(filterChange: TGenericObject | string) {
    if (typeof filterChange === 'string') {
      onChange({ [attribute.getName()]: filterChange })
    } else {
      onChange({
        [attribute.getName()]: {
          ...(value as TGenericObject),
          ...filterChange,
        },
      })
    }
  }

  useEffect(() => {
    if (expanded && !attribute.isPrimitive()) {
      dmssAPI
        .blueprintGet({ typeRef: attribute.attr.attributeType })
        .then((response: AxiosResponse<TGenericObject>) => {
          const data = response.data
          setNestedAttributes(data.attributes)
        })
        .catch((error) => {
          NotificationManager.error(`${error.message}`)
          console.error(error)
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
          value={(value as string) || ''}
          type={'text'}
          onChange={(event) => {
            nestedOnChange(event.target.value)
          }}
        />
        <TypeHint>{attribute.attr.attributeType}</TypeHint>
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
              value={(value as TGenericObject)?.[attr.name]}
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

function FilterContainer({
  search,
  queryError,
  searchFilter,
  setSearchFilter,
  sortByAttribute,
  setSortByAttribute,
  resetSearchSettings,
}: {
  search: (query: TGenericObject) => void
  queryError: string
  searchFilter: TGenericObject
  setSearchFilter: (newFilter: TGenericObject) => void
  sortByAttribute: string
  setSortByAttribute: (newAttribute: string) => void
  resetSearchSettings: () => void
}) {
  const [attributes, setAttributes] = useState<TAttribute[]>([])
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  function onChange(filterChange: TGenericObject) {
    setSearchFilter({ ...searchFilter, ...filterChange })
  }

  // When the filters "type" value changes. Fetch the blueprint
  useEffect(() => {
    if (searchFilter?.type) {
      dmssAPI
        .blueprintGet({ typeRef: searchFilter.type })
        .then((response: AxiosResponse<TGenericObject>) => {
          const data = response.data
          setAttributes(data.attributes)
        })
        .catch((error) => {
          NotificationManager.error(`${error.message}`)
          console.error(error)
        })
    }
  }, [searchFilter?.type])

  return (
    <Wrapper>
      <b>Filter</b>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          search(searchFilter)
        }}
      >
        <Group>
          <FilterGroup>
            <label style={{ marginRight: '10px' }}>Type: </label>
            <BlueprintPicker
              formData={searchFilter?.type || ''}
              onChange={(event: string) => setSearchFilter({ type: event })}
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
                {attributes.map((attribute: TAttribute) => (
                  <DynamicAttributeFilter
                    value={searchFilter[attribute.name]}
                    attr={attribute}
                    key={attribute.name}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          )}
          Query:
          <JsonView data={searchFilter} />
          {queryError && (
            <>
              <text>Error:</text>
              <JsonView
                data={queryError}
                style={{ fontSize: '12px', color: 'red' }}
              />
            </>
          )}
          <SortByAttribute
            sortByAttribute={sortByAttribute}
            setSortByAttribute={setSortByAttribute}
          />
          <ButtonContainer>
            <button
              type={'button'}
              onClick={() => {
                setAttributes([])
                resetSearchSettings()
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
function EntityRow(props: {
  entity: { _id: string; name: string; type: string; description: string }
  absoluteId: string
}) {
  const { entity, absoluteId } = props
  return (
    <>
      <tr>
        <TabelData>{entity.name}</TabelData>
        <TabelData>{entity.type}</TabelData>
        <TabelData>{entity.description}</TabelData>
        <TabelData>{entity._id}</TabelData>
        <td style={{ padding: '5px' }}>
          <Link to={{ pathname: `view/${absoluteId}` }}>
            View
            <EyeIcon />
          </Link>
        </td>
      </tr>
    </>
  )
}

function ResultContainer(props: { result: { [key: string]: any } }) {
  const { result } = props
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

            {Object.entries(result).map(
              ([absoluteId, entity]: [string, any]) => (
                <EntityRow
                  key={entity._id}
                  entity={entity}
                  absoluteId={absoluteId}
                />
              )
            )}
          </tbody>
        </table>
      </Group>
    </Wrapper>
  )
}

function SelectDataSource(props: {
  selectedDataSources: string[]
  setDataSources: (ds: string[]) => void
  allDataSources: TDataSources
}) {
  const { selectedDataSources, setDataSources, allDataSources } = props
  return (
    <Wrapper
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'self-end',
        marginTop: '10px',
      }}
    >
      <Autocomplete
        options={allDataSources.map((dataSource: TDataSource) => dataSource.id)}
        label={'Select data sources to search'}
        multiple
        initialSelectedOptions={selectedDataSources}
        onOptionsChange={(event: AutocompleteChanges<string>) => {
          if (event.selectedItems) {
            setDataSources(event.selectedItems)
          }
        }}
      />
      <FaDatabase
        style={{
          color: 'gray',
          width: '28px',
          height: '28px',
          marginLeft: '5px',
        }}
      />
    </Wrapper>
  )
}

export default ({ settings }: TGenericObject) => {
  const [searchSettings, setSearchSettings] = useLocalStorage<TGenericObject>(
    'searchSettings',
    {
      dataSources: [],
      sortByAttribute: DEFAULT_SORT_BY_ATTRIBUTE,
      filter: {},
    }
  )
  const [result, setResult] = useState<{ [key: string]: any }>({})
  const [queryError, setQueryError] = useState('')
  const [dataSources, setDataSources] = useState<TDataSources>([])
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    dmssAPI
      .dataSourceGetAll()
      .then((response: AxiosResponse<DataSourceInformation[]>) => {
        const dataSources: TDataSources = response.data
        setDataSources(dataSources)
      })
      .catch((error) => {
        console.error(error)
        NotificationManager.error(error, 'Failed to fetch datasources', 0)
      })
  }, [])

  function search(query: TGenericObject) {
    dmssAPI
      .search({
        dataSources: searchSettings.dataSource,
        body: query,
        sortByAttribute: searchSettings.sortByAttribute,
      })
      .then((response: AxiosResponse<TGenericObject>) => {
        setQueryError('')
        const nResults = Object.keys(response.data).length
        if (nResults === 0) {
          NotificationManager.warning('No entities found', 'Search')
        } else {
          NotificationManager.success(
            `Found ${nResults} matching ${
              nResults > 1 ? 'entities' : 'entity'
            }`,
            'Search'
          )
        }
        // @ts-ignore
        setResult(response.data)
      })
      .catch((err: AxiosError<any>) => {
        setQueryError(err.response?.data?.message)
        console.error(err)
      })
  }

  return (
    <>
      <SelectDataSource
        selectedDataSources={searchSettings.dataSources}
        setDataSources={(dataSources) =>
          setSearchSettings({ ...searchSettings, dataSources: dataSources })
        }
        allDataSources={dataSources}
      />
      <ApplicationContext.Provider
        value={{ ...settings, displayAllDataSources: true }}
      >
        <FilterContainer
          search={search}
          queryError={queryError}
          searchFilter={searchSettings.filter}
          setSearchFilter={(filter) =>
            setSearchSettings({ ...searchSettings, filter: filter })
          }
          sortByAttribute={searchSettings.sortByAttribute}
          setSortByAttribute={(sortByAttribute) =>
            setSearchSettings({
              ...searchSettings,
              sortByAttribute: sortByAttribute,
            })
          }
          resetSearchSettings={() =>
            setSearchSettings({
              sortByAttribute: DEFAULT_SORT_BY_ATTRIBUTE,
              filter: {},
              dataSources: searchSettings.dataSource,
            })
          }
        />
      </ApplicationContext.Provider>
      <ResultContainer result={result} />
    </>
  )
}
