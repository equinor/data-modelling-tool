import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Divider, Progress, Tabs } from '@equinor/eds-core-react'
import OperationsTable from '../components/Operations/OperationsTable'
import useSearch from '../hooks/useSearch'
import { DmtSettings, TOperation, TOperationStatus } from '../Types'
import SearchInput from '../components/SearchInput'
import styled from 'styled-components'
import { AuthContext } from '@dmt/common'
import DateRangePicker from '../components/DateRangePicker'
import Grid from '../components/App/Grid'
import { Blueprints, OperationStatus } from '../Enums'
import { getUsername, hasExpertRole } from '../utils/auth'
import { statusFromDates } from '../utils/statusFromDates'

const GridContainer = styled.div`
  padding-top: 50px;
`

const OperationOverview = (props: DmtSettings): JSX.Element => {
  const { settings } = props
  const [allOperations, setAllOperations] = useState<TOperation[]>([])
  const [operationsFilteredBySearch, setOperationsFilteredBySearch] = useState<
    TOperation[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dateRange, setDateRange] = useState<Date[]>()
  const [activeTab, setActiveTab] = useState<number>(0)
  const location = useLocation()
  const { tokenData } = useContext(AuthContext)
  const operationStatus: (
    | TOperationStatus
    | 'All operations'
    | 'My operations'
  )[] = [
    'All operations',
    OperationStatus.ONGOING,
    OperationStatus.UPCOMING,
    OperationStatus.CONCLUDED,
    'My operations',
  ]
  const [searchResult, isLoadingSearch, hasError] = useSearch(
    Blueprints.OPERATION
  )

  const filterOperationsByStatus = (tabIndex: number) => {
    switch (operationStatus[tabIndex]) {
      case 'All operations':
        return allOperations
      case OperationStatus.ONGOING:
        return allOperations.filter(
          (operation: TOperation) =>
            OperationStatus.ONGOING ===
            statusFromDates(operation.start, operation.end)
        )
      case OperationStatus.UPCOMING:
        return allOperations.filter(
          (operation: TOperation) =>
            OperationStatus.UPCOMING ===
            statusFromDates(operation.start, operation.end)
        )
      case OperationStatus.CONCLUDED:
        return allOperations.filter(
          (operation: TOperation) =>
            OperationStatus.CONCLUDED ===
            statusFromDates(operation.start, operation.end)
        )
      case 'My operations':
        return allOperations.filter((operation: TOperation) => {
          return operation.creator === getUsername(tokenData)
        })
      default:
        return []
    }
  }

  /**
   * Set operations when the search has completed
   */
  useEffect(() => {
    if (searchResult) {
      setAllOperations(searchResult)
      setOperationsFilteredBySearch(searchResult)
      setIsLoading(false)
    }
  }, [searchResult])

  useEffect(() => {
    if (isLoadingSearch) {
      setIsLoading(isLoadingSearch)
    }
  }, [isLoadingSearch])

  useEffect(() => {
    if (hasError) {
      setIsLoading(false)
    }
  }, [hasError])

  /**
   * Allow filtering of operations by name
   * @param event
   */
  const handleSearch = (event: any) => {
    const nameSearchQuery = event.target.value
    if (nameSearchQuery) {
      setOperationsFilteredBySearch(
        allOperations.filter((operation: TOperation) =>
          operation.name.toLowerCase().includes(nameSearchQuery)
        )
      )
    } else {
      setOperationsFilteredBySearch(allOperations)
    }
  }

  const filerOperationsByDateRange = () => {
    const START_INDEX: number = 0
    const END_INDEX: number = 1

    const operationsFilteredByDateRange: TOperation[] = allOperations.filter(
      (operation: TOperation) => {
        if (dateRange) {
          return (
            operation.start &&
            new Date(operation.start).setHours(0, 0, 0, 0) >=
              dateRange[START_INDEX].setHours(0, 0, 0, 0).valueOf() &&
            operation.end &&
            new Date(operation.end).setHours(0, 0, 0, 0) <=
              dateRange[END_INDEX].setHours(0, 0, 0, 0).valueOf()
          )
        } else {
          return allOperations
        }
      }
    )
    return operationsFilteredByDateRange
  }
  const getVisibleOperations = () => {
    //Only the intersection of different filters will be visible.
    const operationsFilteredByStatus: TOperation[] = filterOperationsByStatus(
      activeTab
    )
    const operationsFilteredByDateRange: TOperation[] = filerOperationsByDateRange()
    return allOperations.filter((operation) => {
      return (
        operationsFilteredBySearch.includes(operation) &&
        operationsFilteredByStatus.includes(operation) &&
        operationsFilteredByDateRange.includes(operation)
      )
    })
  }

  return (
    <>
      <Tabs
        activeTab={activeTab}
        onChange={(index: number) => setActiveTab(index)}
        variant={'minWidth'}
      >
        <Tabs.List>
          {operationStatus.length ? (
            operationStatus.map((state: string) => (
              <Tabs.Tab key={state}>{state}</Tabs.Tab>
            ))
          ) : (
            <div />
          )}
        </Tabs.List>
        <GridContainer>
          <Grid>
            <SearchInput onChange={handleSearch} />
            <DateRangePicker setDateRange={setDateRange} />
            <div style={{ paddingTop: '13px' }}>
              <Link
                to={{
                  pathname: `/${settings.name}/operations/new`,
                  state: location.state,
                }}
              >
                {hasExpertRole(tokenData) && (
                  <Button>Create new operation</Button>
                )}
              </Link>
            </div>
          </Grid>
        </GridContainer>
        <Divider variant="medium" />
        {isLoading && <Progress.Linear />}
        <OperationsTable
          operations={getVisibleOperations()}
          settings={settings}
        />
      </Tabs>
    </>
  )
}

export default OperationOverview
