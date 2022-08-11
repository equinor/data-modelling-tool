import React, { useContext, useState } from 'react'
import { getUsername } from '../../utils/auth'
import { AuthContext } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { createAnalysis } from '../../utils/CRUD'
import { EBlueprints } from '../../Enums'
import { DEFAULT_DATASOURCE_ID } from '../../const'
import { CreateAnalysisForm } from './components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TAnalysis } from '../../Types'

export const AnalysisCreate = (): JSX.Element => {
  const { tokenData, token } = useContext(AuthContext)
  const user = getUsername(tokenData) || 'NoLogin'
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const createdAt = new Date().toISOString()

  const handleCreateAnalysis = (formData: TAnalysis) => {
    setIsLoading(true)
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
        // TODO: Should we use props.history.push instead?
        //@ts-ignore
        document.location = `${DEFAULT_DATASOURCE_ID}/${documentId}/`
      })
      .catch((error: any) => {
        console.error(error)
        const errorMessage =
          error.response?.data?.message || 'Failed to create new analysis'
        NotificationManager.error(errorMessage)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) return <Progress.Linear />

  return <CreateAnalysisForm onSubmit={handleCreateAnalysis} />
}
