import ViewBlueprintForm from '../../blueprints/blueprint/ViewBlueprintForm'
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

const UI_RECIPES = ['PREVIEW', 'EDIT']

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
  return (
    <Tabs>
      <TabList>
        {UI_RECIPES.map((uiRecipe: string) => {
          return <Tab key={uiRecipe}>{uiRecipe}</Tab>
        })}
      </TabList>
      {UI_RECIPES.map((uiRecipe: string) => {
        return (
          <TabPanel key={uiRecipe}>
            <View {...props} uiRecipe={uiRecipe} />
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
