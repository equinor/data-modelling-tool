import React, { useState } from 'react'
import styled from 'styled-components'
import Header from './common/Header'
import BlueprintSelectorWidget from '../plugins/form-rjsf-widgets/BlueprintSelectorWidget'
import PreviewView from '../components/CodeView'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import Api2 from '../api/Api2'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 20px;
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

// @ts-ignore
function FilterContainer({ search }) {
  const [filter, setFilter] = useState({})

  function onChange(filterChange: any) {
    setFilter({ ...filter, ...filterChange })
  }

  return (
    <Container>
      <b>Filter</b>
      <Group>
        <FilterGroup>
          <label style={{ marginRight: '10px' }}>Type: </label>
          <BlueprintSelectorWidget
            formData={''}
            onChange={(event: any) => {
              onChange({ type: event })
            }}
            uiSchema={{}}
          />
        </FilterGroup>
        <FilterGroup>
          <label style={{ marginRight: '10px' }}>Name:</label>
          <input
            type={'text'}
            onChange={(event: any) => {
              onChange({ name: event.target.value })
            }}
          />
        </FilterGroup>
        Query:
        <PreviewView data={filter} style={{ fontSize: '8px' }} />
        <ButtonContainer>
          <button onClick={() => search(filter)}>Search</button>
        </ButtonContainer>
      </Group>
    </Container>
  )
}

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

  function search(query: any) {
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
        NotificationManager.error(`Search error: ${err.response.data.detail}`)
        console.log(err)
      },
    })
  }

  return (
    <>
      <FilterContainer search={search} />
      <ResultContainer result={result} />
    </>
  )
}
