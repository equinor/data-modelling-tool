import React, { useState } from 'react'

import styled from 'styled-components'
import FetchDocument from '../../../utils/FetchDocument'
import Tabs, { Tab, TabPanel } from '../../../components/Tabs'
import { UiRecipe } from '../../../domain/types'
import { GenerateUiRecipeTabs } from './GenerateUiRecipeTabs'
import { ErrorGroup } from '../../../components/Wrappers'
import useExplorer, { IUseExplorer } from '../../../hooks/useExplorer'
import { getUIPlugin } from '@dmt/core-plugins'
import { createEntity } from '../../../utils/createEntity'

const Wrapper = styled.div`
  padding: 20px;
`

const View = (props: any) => {
  const { dataSourceId, documentId, uiRecipe, document } = props

  const explorer: IUseExplorer = useExplorer({})
  const [loading, setLoading] = useState(false)

  const fetchBlueprint = (type: string) => {
    return explorer.getBlueprint(type)
  }

  const onSubmit = (formData: any) => {
    setLoading(true)
    const node = explorer.index.models.index.models.tree.operations.getNode(
      documentId
    )
    const target = documentId.split('.')
    explorer
      .updateById({
        dataSourceId,
        documentId: target.shift(),
        attribute: target.join('.'),
        data: formData,
        nodeUrl: node.meta.indexUrl,
      })
      .then(() => setLoading(false))
  }

  if (loading) return <div>Loading...</div>

  const ExternalPlugin = getUIPlugin(uiRecipe.plugin)
  // rjsf-form is the only plugin that needs this uiRecipe name
  return (
    <ExternalPlugin
      dataSourceId={dataSourceId}
      documentId={documentId}
      explorer={explorer}
      uiRecipe={uiRecipe}
      uiRecipeName={uiRecipe.name}
      updateDocument={onSubmit}
      document={document}
      fetchBlueprint={fetchBlueprint}
      createDocument={createEntity}
      // TODO: Deprecate onSubmit, and only provide updateDocument
      onSubmit={onSubmit}
    />
  )
}

type ViewListProps = {
  blueprintType: any
  document: any
}

const ViewList = (props: ViewListProps) => {
  const generateUiRecipeTabs = new GenerateUiRecipeTabs(
    props.blueprintType.uiRecipes
  )
  const uiRecipeTabs: UiRecipe[] = generateUiRecipeTabs.uiRecipeTabs

  return (
    <Tabs>
      <>
        {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
          return (
            <Tab key={uiRecipe.name + uiRecipe.plugin} id={uiRecipe.plugin}>
              {uiRecipe.name}
            </Tab>
          )
        })}
      </>
      {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
        return (
          <TabPanel key={uiRecipe.name + uiRecipe.plugin}>
            <View {...props} uiRecipe={uiRecipe} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

const DocumentComponent = (props: any) => {
  const { dataSourceId, documentId } = props

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Wrapper>
        <FetchDocument
          dataSourceId={dataSourceId}
          documentId={documentId}
          render={(data: any) => {
            const document = data?.document
            return (
              <>
                {document ? (
                  <ViewList
                    {...props}
                    document={data.document}
                    blueprintType={data.blueprint}
                  />
                ) : (
                  <ErrorGroup>
                    <b>404</b>
                    <b>
                      No document found{' '}
                      <code>
                        {dataSourceId}/{documentId}
                      </code>
                    </b>
                  </ErrorGroup>
                )}
              </>
            )
          }}
        />
      </Wrapper>
    </React.Suspense>
  )
}

export default DocumentComponent