import {
  AuthContext,
  hasExpertRole,
  Loading,
  useSearch,
} from '@data-modelling-tool/core'
import React, { ReactNode, useContext } from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../const'
import { EBlueprints } from '../../Enums'
import { TAnalysis } from '../../Types'
import { AnalysisTable, CreateAnalysisButton } from './components'
import { Divider } from '@equinor/eds-core-react'

export const AnalysisOverview = (): JSX.Element => {
  // @ts-ignore
  const { tokenData } = useContext(AuthContext)
  const [analyses, isLoading] = useSearch<TAnalysis>(
    {
      type: EBlueprints.ANALYSIS,
    },
    DEFAULT_DATASOURCE_ID
  )

  if (isLoading) return <Loading />

  return (
    <>
      {hasExpertRole(tokenData) && (
        <>
          <CreateAnalysisButton />
          <Divider variant="medium" />
        </>
      )}
      <AnalysisTable analyses={analyses} />
    </>
  )
}
