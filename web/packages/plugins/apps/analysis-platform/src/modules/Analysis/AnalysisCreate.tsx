import React, { useContext, useState } from 'react'
import { getUsername } from '../../utils/auth'
import { AuthContext } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { createAnalysis } from './CRUD'
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

  const handleCreateAnalysis = (formData: TAnalysis) => {
    console.log('run')
    setIsLoading(true)
    const data = {
      ...formData,
      type: EBlueprints.ANALYSIS,
      creator: user,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      task: {
        type: EBlueprints.TASK,
      },
    }
    createAnalysis(data, token, [])
      .then((documentId: any) => {
        // TODO: Should we use props.history.push instead?
        console.log('doc id', documentId)
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
