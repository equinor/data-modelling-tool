import React, { useContext, useState } from 'react'
import { Button, Label } from '@equinor/eds-core-react'
import { UIPluginSelector } from './UiPluginSelector'
import { CustomScrim } from './Modal/CustomScrim'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { DestinationPicker } from './Pickers'
import { addToPath } from './UploadFileButton'
import { AuthContext, TReference } from '..'

export function NewEntityButton(props: {
  type: string
  setReference: (r: TReference) => void
}) {
  const { type, setReference } = props
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>('')
  // @ts-ignore
  const { token } = useContext(AuthContext)

  function addEntityToPath(entity: any): Promise<string> {
    // There are some limitations to be aware of
    // We can not mix updating and not updating non-contained entities in the same request...
    const [dataSource, ...directories] = saveDestination.split('/')
    const directory = directories.join('/')
    return addToPath(entity, token, [], dataSource, directory)
      .then((newId: string) =>
        setReference({ _id: newId, type: entity.type, name: entity.name })
      )
      .catch((error: string) =>
        NotificationManager.error(`Failed to create entity; ${error}`, 'Failed')
      )
  }

  return (
    <div style={{ display: 'flex', margin: '5px' }}>
      <Button onClick={() => setShowScrim(true)}>New</Button>
      {showScrim && (
        <CustomScrim
          closeScrim={() => setShowScrim(false)}
          header={`Create new entity`}
          width={'40vw'}
          height={'70vh'}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Label label={'Folder for new entity'} />
            <DestinationPicker
              onChange={(value: any) => {
                setSaveDestination(value)
              }}
              formData={saveDestination}
            />
            {/*<Button onClick={() => {*/}
            {/*  addEntityToPath({*/}
            {/*      name: "test123",*/}
            {/*      type: "AnalysisPlatformDS/Blueprints/SIMAApplicationInput",*/}
            {/*      inputType: "system/SIMOS/NamedEntity",*/}
            {/*      outputType: "system/SIMOS/NamedEntity",*/}
            {/*      workflowTask: "response_forecast",*/}
            {/*      workflow: "runEnsemble",*/}
            {/*      resultPath: "AnalysisPlatformDS/Data/Analysis/results",*/}
            {/*      description: "example SIMA application input for local container",*/}
            {/*      input:*/}
            {/*        {*/}
            {/*          name: "exampleAnalysis",*/}
            {/*          type: "system/SIMOS/NamedEntity",*/}
            {/*        },*/}
            {/*    },*/}
            {/*  )*/}
            {/*}*/}
            {/*}>Test Button</Button>*/}

            <UIPluginSelector
              entity={{ type: type }}
              onSubmit={(newEntity: any) => {
                if (!saveDestination) {
                  NotificationManager.warning(
                    'No destination for saving entity selected',
                    'Incomplete'
                  )
                } else {
                  addEntityToPath(newEntity)
                  setShowScrim(false)
                  NotificationManager.success(
                    `New ${newEntity.type} created`,
                    'Created'
                  )
                }
              }}
            />
          </div>
        </CustomScrim>
      )}
    </div>
  )
}
