import React, { useContext, useState } from 'react'

import { getUsername } from '../../utils/auth'
import {
  AuthContext,
  ApplicationContext,
  ErrorResponse,
  DmssAPI,
} from '@development-framework/dm-core'
import { Progress } from '@equinor/eds-core-react'
import { EBlueprints } from '../../Enums'
import { ANALYSIS_PATH, DEFAULT_DATASOURCE_ID } from '../../const'
import { CreateAnalysisForm } from './components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TAnalysis } from '../../Types'
import { useParams } from 'react-router-dom'
import { AxiosError, AxiosResponse } from 'axios'

export const AnalysisCreate = (): JSX.Element => {
  const { asset_id } = useParams<{ asset_id: string }>()
  const settings = useContext(ApplicationContext)
  const { tokenData, token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const user = getUsername(tokenData)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUpdateAsset = async (assetId: string, analysis: TAnalysis) => {
    const newAnalysis = {
      _id: analysis._id,
      type: EBlueprints.ANALYSIS,
      name: analysis.name || '',
    }
    return await dmssAPI.referenceInsert({
      dataSourceId: DEFAULT_DATASOURCE_ID,
      documentDottedId: `${assetId}.analyses`,
      reference: newAnalysis,
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
    dmssAPI
      .documentAddToPath({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        updateUncontained: false,
        document: JSON.stringify(data),
        directory: ANALYSIS_PATH,
      })
      .then((response: AxiosResponse<any>) => {
        const newUID = response.data.uid
        const newAnalysis = { ...formData, _id: newUID }
        if (asset_id) {
          handleUpdateAsset(asset_id, newAnalysis)
            .then(
              () =>
                (document.location = `/${settings.urlPath}/view/${DEFAULT_DATASOURCE_ID}/${newUID}`)
            )
            .catch((error: AxiosError<any>) => {
              console.log(error.response?.data)
              NotificationManager.error(error.response?.data)
            })
        } else {
          // TODO: Should we use props.history.push instead?
          document.location = `/${settings.urlPath}/view/${DEFAULT_DATASOURCE_ID}/${newUID}`
        }
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
