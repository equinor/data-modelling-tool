import React, { useContext, useState } from 'react'
import { getUsername } from '../../utils/auth'
import {
  DmssAPI,
  AuthContext,
  ApplicationContext,
  TGenericObject,
} from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import { EBlueprints } from '../../Enums'
import { ASSET_PATH, DEFAULT_DATASOURCE_ID } from '../../const'
import { CreateAssetForm } from './components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TAsset } from '../../Types'
import { AxiosResponse } from 'axios'

export const AssetCreate = (): JSX.Element => {
  const settings = useContext(ApplicationContext)
  const { tokenData, token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const user = getUsername(tokenData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const createdAt = new Date().toISOString()

  const handleCreateAsset = (formData: TAsset) => {
    setIsLoading(true)
    const data = {
      ...formData,
      type: EBlueprints.ASSET,
      creator: user,
      created: createdAt,
      updated: createdAt,
      location: formData.location || {
        type: EBlueprints.LOCATION,
      },
    }

    dmssAPI
      .explorerAddToPath({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        document: JSON.stringify(data),
        directory: `/${ASSET_PATH}`,
      })
      .then((response: AxiosResponse<TGenericObject>) => {
        const documentId: string = response.data.uid
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
        const errorMessage = errorResponse || 'Failed to create new asset'
        NotificationManager.error(errorMessage)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) return <Progress.Linear />

  return <CreateAssetForm onSubmit={handleCreateAsset} />
}
