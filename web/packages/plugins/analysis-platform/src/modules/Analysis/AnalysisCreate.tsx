import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getUsername } from '../../utils/auth'
import { AuthContext, ApplicationContext, ErrorResponse } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { createAnalysis, addAnalysisToAsset } from '../../utils/CRUD'
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

  const handleUpdateAsset = (assetId: string, analysis: TAnalysis) => {
    const newAnalysis = {
      _id: analysis._id,
      type: EBlueprints.ANALYSIS,
      name: analysis.name || '',
    }
    const attribute = 'analyses'
    addAnalysisToAsset(`${assetId}.${attribute}`, newAnalysis, token)
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
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        NotificationManager.error(error.response?.data.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) return <Progress.Linear />

  return <CreateAnalysisForm onSubmit={handleCreateAnalysis} />
}
