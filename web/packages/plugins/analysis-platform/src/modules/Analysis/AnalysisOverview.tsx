import { Loading, useSearch } from '@dmt/common'
import React, { ReactNode } from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../const'
import { EBlueprints } from '../../Enums'
import { TAnalysis } from '../../Types'
import { AnalysisTable } from './components'

export const AnalysisOverview = (): ReactNode => {
  const [analyses, isLoading] = useSearch<TAnalysis>(
    {
      type: EBlueprints.ANALYSIS,
    },
    DEFAULT_DATASOURCE_ID
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <AnalysisTable analyses={analyses} />
    </>
  )
}
