import React from 'react'
import styled from 'styled-components'
import AnalysisCard from './AnalysisCard'
import { TAnalysisCardProps } from '../Types'

const OnRight = styled.div`
  display: flex;
  margin-right: 50px;
`

export const AnalysisInfoCard = (props: TAnalysisCardProps) => {
  const { analysis, addJob, jobs, dataSourceId } = props

  return (
    <>
      <OnRight>
        <AnalysisCard
          analysis={analysis}
          addJob={addJob}
          jobs={jobs}
          dataSourceId={dataSourceId}
        />
      </OnRight>
    </>
  )
}
