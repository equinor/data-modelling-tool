// @ts-ignore
import { hasExpertRole, Loading, useSearch } from '@data-modelling-tool/core'
import React, { ReactNode, useContext } from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../const'
import { EBlueprints } from '../../Enums'
import { TAnalysis } from '../../Types'
import { AnalysisTable, CreateAnalysisButton } from './components'
import { Divider } from '@equinor/eds-core-react'
import { AuthContext } from 'react-oauth2-code-pkce'

export const AnalysisOverview = (): JSX.Element => {
  const { tokenData } = useContext(AuthContext)
  // @ts-ignore
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
