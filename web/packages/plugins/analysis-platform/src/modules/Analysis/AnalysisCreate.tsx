import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getUsername } from '../../utils/auth'
import { DmssAPI, AuthContext, ApplicationContext } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { createAnalysis } from '../../utils/CRUD'
import { EBlueprints } from '../../Enums'
import { DEFAULT_DATASOURCE_ID } from '../../const'
import { CreateAnalysisForm } from './components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TAnalysis } from '../../Types'
import { AxiosError } from 'axios'

export const AnalysisCreate = (): JSX.Element => {
  const { asset_id } = useParams<{
    asset_id: string
  }>()
  const settings = useContext(ApplicationContext)
  const { tokenData, token } = useContext(AuthContext)
  const user = getUsername(tokenData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dmssAPI = new DmssAPI(token)

  const handleUpdateAsset = (assetId: string, analysis: TAnalysis) => {
    const newAnalysis = {
      _id: analysis._id,
      type: EBlueprints.ANALYSIS,
      name: analysis.name || '',
    }
    const attribute = 'analyses'
    dmssAPI
      .referenceInsert({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        documentDottedId: `/${assetId}.${attribute}`,
        reference: newAnalysis,
      })
      .catch((error: AxiosError<any>) => {
        NotificationManager.error(
          error?.response?.data?.message || error.message
        )
      })
  }

  const handleCreateAnalysis = (formData: TAnalysis) => {
    setIsLoading(true)
    const createdAt = new Date().toISOString()
    const data = {
      ...formData,
      type: EBlueprints.ANALYSIS,
      creator: user,
      created: createdAt,
      updated: createdAt,
      task: {
        type: EBlueprints.TASK,
      },
    }
    createAnalysis(data, token, [])
      .then((documentId: any) => {
        const newAnalysis = { ...formData, _id: documentId }
        handleUpdateAsset(asset_id, newAnalysis)
        // TODO: Should we use props.history.push instead?
        //@ts-ignore
        document.location = `/${settings.urlPath}/view/${DEFAULT_DATASOURCE_ID}/${documentId}`
      })
      .catch((error: any) => {
        console.error(error)
        const errorResponse =
          typeof error.response?.data == 'object'
            ? error.response?.data?.message
            : error.response?.data
        const errorMessage = errorResponse || 'Failed to create new analysis'
        NotificationManager.error(errorMessage)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) return <Progress.Linear />

  return <CreateAnalysisForm onSubmit={handleCreateAnalysis} />
}
