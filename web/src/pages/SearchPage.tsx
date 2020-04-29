import React, { useState } from 'react'
import styled from 'styled-components'
import BlueprintSelectorWidget from '../plugins/form-rjsf-widgets/BlueprintSelectorWidget'
import PreviewView from '../components/CodeView'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import Api2 from '../api/Api2'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 20px;
`
const TypeHint = styled.text`
  align-self: flex-end;
  margin-left: 5px;
`

const AttributeName = styled.label`
  align-self: flex-end;
  margin-right: 10px;
  padding-right: 50px;
`

const TabelData = styled.td`
  overflow: hidden;
  border: 1px solid black;
  padding: 5px;
  max-width: 50px;
`

const TabelRow = styled.tr`
  cursor: pointer;
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
  padding: 10px 0;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

// Creates a text <input> with labels based on a BlueprintAttribute
function DynamicAttributeFilter({ attr, onChange }: any) {
  const attribute = new BlueprintAttribute(attr)

  return (
    <>
      {attribute.getName() !== 'type' && attribute.isPrimitive() && (
        <FilterGroup>
          <AttributeName>{attribute.getPrettyName()}:</AttributeName>
          <input
            type={'text'}
            onChange={(event: any) => {
              onChange({ [attribute.getName()]: event.target.value })
            }}
          />
          <TypeHint>{attribute.getAttributeType()}</TypeHint>
        </FilterGroup>
      )}
    </>
  )
}

// @ts-ignore
function FilterContainer({ search, queryError }) {
  const [filter, setFilter] = useState({})
  const [attributes, setAttributes] = useState([])

  function fetchBlueprint(type: string) {
    Api2.get({
      url: `/api/v2/documents_by_path/${type}`,
      onSuccess: (res: any) => {
        setAttributes(res.document.attributes)
      },
      onError: (err: any) => {
        NotificationManager.error(`${err.message}`)
        console.log(err)
      },
    })
  }

  function onChange(filterChange: any) {
    setFilter({ ...filter, ...filterChange })
  }

  return (
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
              formData={''}
              onChange={(event: any) => {
                fetchBlueprint(event)
                onChange({ type: event })
              }}
              uiSchema={{}}
            />
          </FilterGroup>
          {attributes.length !== 0 && (
            <div
              style={{
                display: 'flex',
                flexFlow: 'row-reverse',
                justifyContent: 'space-between',
              }}
            >
              {/*
          // @ts-ignore */}
              <div
                style={{ flexFlow: 'column', width: '-webkit-fill-available' }}
              >
                <QueryInstructions>
                  Strings will be matched by case insensitive wild card
                </QueryInstructions>
                <QueryInstructions>
                  Numbers can be exact, or with {'">"'} and {'"<"'} operators
                </QueryInstructions>
                <QueryInstructions>
                  Filtering on complex types are not supported
                </QueryInstructions>
              </div>
              <div style={{ flexFlow: 'column' }}>
                {attributes.map(attribute => (
                  <DynamicAttributeFilter
                    attr={attribute}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          )}
          <text>Query:</text>
          <PreviewView data={filter} />
          {queryError && (
            <>
              <text>Error:</text>
              <PreviewView
                data={queryError}
                style={{ fontSize: '12px', color: 'red' }}
              />
            </>
          )}
          <ButtonContainer>
            <button type={'submit'}>Search</button>
          </ButtonContainer>
        </Group>
      </form>
    </Container>
  )
}

// Return a TabelRow for an entity. Clickable to toggle view of the raw document
function EntityRow({ entity }: any) {
  const [documentVisible, setDocumentVisible] = useState(false)
  return (
    <>
      <TabelRow onClick={() => setDocumentVisible(!documentVisible)}>
        <TabelData>{entity.name}</TabelData>
        <TabelData>{entity.type}</TabelData>
        <TabelData>{entity.description}</TabelData>
      </TabelRow>
      <TabelRow>
        {documentVisible && (
          <TabelData colSpan={3}>
            <PreviewView data={entity} />
          </TabelData>
        )}
      </TabelRow>
    </>
  )
}

function ResultContainer({ result, setViewData }: any) {
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
            </tr>
            {result.map((entity: any) => (
              <EntityRow
                key={entity._id}
                entity={entity}
                onClick={(entity: string) => setViewData(entity)}
              />
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
    Api2.post({
      url: '/api/search/entities',
      data: query,
      onSuccess: (res: any) => {
        // @ts-ignore
        let resultList = []
        Object.keys(res.data).map(key => resultList.push(res.data[key]))
        if (resultList.length === 0) {
          NotificationManager.success('Search complete!\n No results')
        } else {
          NotificationManager.success(
            `Search complete!\n ${resultList.length} results`
          )
        }
        // @ts-ignore
        setResult(resultList)
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.detail || err?.response?.data?.message
        setQueryError(message)
        console.log(err)
      },
    })
  }

  return (
    <>
      <FilterContainer search={search} queryError={queryError} />
      <ResultContainer result={result} />
    </>
  )
}
