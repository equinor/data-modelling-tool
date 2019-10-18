import React from 'react'
import ReactJsonSchemaWrapper from '../form/ReactJsonSchemaWrapper'
import styled from 'styled-components'
import FetchDocument from '../utils/FetchDocument'
// @ts-ignore
import objectPath from 'object-path'
import Tabs, { Tab, TabList, TabPanel } from '../../../components/Tabs'
import BlueprintPreview from '../../../plugins/preview/PreviewPlugin'

const Wrapper = styled.div`
  padding: 20px;
`

// These UI recipes should always be shown
const DEFAULT_UI_RECIPES = ['PREVIEW', 'EDIT']

const View = (props: any) => {
  const { schemaUrl, document, dataUrl, attribute, uiRecipe } = props
  // TODO: Dont explicit add plugins, let plugins add them self to our code, to actually make it a plugin
  return (
    <FetchDocument
      url={`${schemaUrl}?ui_recipe=${uiRecipe}`}
      render={(data: any) => {
        const { plugin = '' } = data.uiSchema
        switch (plugin) {
          case 'PREVIEW':
            return <BlueprintPreview data={document} />
          default:
            return (
              <ReactJsonSchemaWrapper
                document={document}
                template={data}
                dataUrl={dataUrl}
                attribute={attribute}
              />
            )
        }
      }}
    />
  )
}

const ViewList = (props: any) => {
  const { document } = props
  const { uiRecipes = [] } = document
  // Create a list of unique UI recipe names
  const uiRecipesNames = Array.from(
    new Set(
      DEFAULT_UI_RECIPES.concat(
        uiRecipes.map((uiRecipe: any) => uiRecipe['name'])
      )
    )
  )

  return (
    <Tabs>
      <TabList>
        {uiRecipesNames.map((uiRecipesName: string) => {
          return <Tab key={uiRecipesName}>{uiRecipesName}</Tab>
        })}
      </TabList>
      {uiRecipesNames.map((uiRecipesName: string) => {
        return (
          <TabPanel key={uiRecipesName}>
            <View {...props} uiRecipe={uiRecipesName} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

const DocumentComponent = (props: any) => {
  const { dataUrl, attribute = null } = props

  return (
    <Wrapper>
      <FetchDocument
        url={dataUrl}
        render={(data: any) => {
          const document = attribute
            ? objectPath.get(data.document, attribute)
            : data.document

          return <ViewList {...props} document={document} />
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
