import React, { useContext, useState } from 'react'
import { getUsername } from '../../utils/auth'
import { AuthContext } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { TAnalysis } from './Types'
import { createAnalysis } from './CRUD'
import { Blueprints } from '../../Enums'
import { DEFAULT_DATASOURCE_ID, TASK } from '../../const'
import CreateAnalysisForm from './components/CreateAnalysisForm'

const AnalysisNew = (): JSX.Element => {
  // @ts-ignore
  const { tokenData, token } = useContext(AuthContext)
  const user = getUsername(tokenData) || 'NoLogin'
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreateAnalysis = (formData: TAnalysis) => {
    setIsLoading(true)
    const data = {
      ...formData,
      type: Blueprints.ANALYSIS,
      creator: user,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      task: {
        type: TASK,
      },
    }
    createAnalysis(data, token, []).then((documentId: any) => {
      // TODO: Should we use props.history.push instead?
      document.location = `${DEFAULT_DATASOURCE_ID}/${documentId}/`
    })
  }

  if (isLoading) return <Progress.Linear />

  return <CreateAnalysisForm onSubmit={handleCreateAnalysis} />
}

export default AnalysisNew
