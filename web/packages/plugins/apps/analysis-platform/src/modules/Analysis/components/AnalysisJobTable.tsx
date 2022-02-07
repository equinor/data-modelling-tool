import { Button, Progress, Table, Typography } from '@equinor/eds-core-react'
import React, { useContext, useState } from 'react'
import { TAnalysis } from '../Types'

type AnalysisJobTableProps = {
  analysis: TAnalysis
}

const AnalysisJobTable = (props: AnalysisJobTableProps) => {
  const { analysis } = props

  return (
    <>
      <Table density="comfortable" style={{ width: '100%' }}>
        <Table.Caption>
          <Typography variant="h3">Runs</Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Job</Table.Cell>
            <Table.Cell>Duration</Table.Cell>
            <Table.Cell>Result</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Success</Table.Cell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>2m 31s</Table.Cell>
            <Table.Cell>LINK</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}

export default AnalysisJobTable
