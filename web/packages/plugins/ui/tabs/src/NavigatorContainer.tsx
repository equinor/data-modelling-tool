import {
  ApplicationContext,
  AuthContext,
  BlueprintEnum,
  CustomScrim,
  DmssAPI,
  DmtUIPlugin,
  GetIcon,
  PATH_INPUT_FIELD_WIDTH,
  Tree,
  TreeNode,
  TreeView,
  truncatePathString,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
import React, { useContext, useEffect, useState } from 'react'
import { Input, Tooltip } from '@equinor/eds-core-react'
import { Button } from '@equinor/eds-core-react'
import styled from 'styled-components'
import Breadcrumb from './Beadcrumb'
import {
  more_vertical,
  share,
  person_add,
  settings,
  arrow_back,
} from '@equinor/eds-icons'
import { Card, Typography, Icon } from '@equinor/eds-core-react'
import { Divider } from '@equinor/eds-core-react'

const icons = {
  more_vertical,
  share,
  person_add,
  settings,
  arrow_back,
}

Icon.add(icons)

const iconSize = 24

const BreadcrumbLink = styled.span`
  &:hover {
    color: blue;
  }
`

const Top = styled.div`
  margin-top: 30px:
  margin-left: 20px;
  padding-left: 30px; 
`

const Center = styled.div``

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  min-height: 200px;
`
const Menu = styled.div`
  align-self: stretch;
  margin-top: 10px;
  padding: 20px;
  min-width: 300px;
`

const Content = styled.div`
  align-self: flex-start;
  padding: 20px;
  min-width: 1024px;
`

const NavigatorItem = styled.div`
  font-size: 2em;
  padding: 2px;
`

const Navigator = (props: any) => {
  const { onSelect, dataSourceId, documentId, entity } = props
  const { token } = useContext(AuthContext)
  const tree = new Tree(token, [dataSourceId], true)
  const [index, setIndex] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    tree
      .from(`${dataSourceId}/${documentId}`, entity)
      // @ts-ignore
      .then(() => setIndex([...tree]))
      .finally(() => setLoading(false))
  }, [documentId])

  return (
    <>
      {index.map((node: TreeNode) => {
        const handleSelect = () => {
          onSelect(node)
        }

        if (node?.parent?.expanded === false) return null
        if (node.type === 'dataSource') return null
        if (node.nodeId === `${dataSourceId}/${documentId}`) return null
        // if (!node.contained) return true

        console.log(node)

        return (
          <NavigatorItem key={node.nodeId} onClick={handleSelect}>
            <Typography bold={!node.attributeData.contained}>
              <GetIcon node={node} /> {node?.attribute || node.name}
            </Typography>
          </NavigatorItem>
        )
      })}
    </>
  )
}

export const NavigatorContainer = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, config, document } = props
  const [elements, setElements] = useState([
    {
      name: document.name,
      absoluteId: `${dataSourceId}/${documentId}`,
      type: '',
      root: false,
      attribute: '',
      icon: <Icon name="home" size={24} />,
      home: true,
    },
  ])
  const [selectedDocument, setSelectedDocument] = useState<string>(
    `${dataSourceId}/${documentId}`
  )
  const [entity, setDocument] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    const [dd, di] = selectedDocument.split('/', 2)
    setLoading(true)
    let depth = 999
    dmssAPI
      .documentGetById({
        dataSourceId: dd,
        documentId: di,
        depth: depth,
      })
      .then((response: any) => {
        const data = response.data
        if (Object.keys(data).length === 0) {
          setDocument({
            type: elements[elements.length - 1].type,
          })
        } else {
          setDocument(data)
        }
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }, [selectedDocument])

  if (isLoading) return <div>Loading....</div>

  const [dd, di] = selectedDocument.split('/', 2)

  const handleBack = () => {
    const element = elements.pop()
    // @ts-ignore
    const active = elements[elements.length - 1]
    setSelectedDocument(active.absoluteId)
    setElements(elements)
  }

  const handleOpen = (props: any) => {
    const { entity, absoluteDottedId, attribute } = props
    setSelectedDocument(absoluteDottedId)
    const stack = [
      ...elements,
      {
        name: entity.name,
        absoluteId: `${dataSourceId}/${documentId}.${attribute}`,
      },
    ]
    // @ts-ignore
    setElements(stack)
  }

  return (
    <div>
      <Top>
        {elements.length > 1 && (
          <Center>
            <Breadcrumb>
              {elements.map((element: any) => {
                const { name, absoluteId, type, attribute } = element
                // const Icon = options.icons[label]
                return (
                  <div key={absoluteId}>
                    <div
                      onClick={() => {
                        const id: any = elements.findIndex(
                          (element: any) => element.absoluteId === absoluteId
                        )
                        const from = id + 1
                        const to = elements.length - from
                        elements.splice(from, to)
                        setSelectedDocument(absoluteId)
                        setElements(elements)
                      }}
                    >
                      {element.home && <Icon name="home" size={24} />}
                      {!element.home && (
                        <Typography bold={element.root}>
                          {false && element.icon}
                          <BreadcrumbLink>
                            {attribute || name}{' '}
                            {element.root ? `(${element.name})` : ''}
                          </BreadcrumbLink>
                        </Typography>
                      )}
                    </div>
                  </div>
                )
              })}
            </Breadcrumb>
          </Center>
        )}
        {elements.length > 1 && (
          <Button variant="outlined" onClick={handleBack}>
            <Icon name="arrow_back" title="Go back" size={iconSize}></Icon> Back
          </Button>
        )}
      </Top>
      <Wrapper>
        <Menu>
          <>
            {true && (
              <Card>
                <Card.Header>
                  <Card.HeaderTitle>
                    <Typography variant="h5">{entity?.name}</Typography>
                    <Typography variant="body_short">
                      {false && entity?.type}
                    </Typography>
                  </Card.HeaderTitle>
                </Card.Header>
                <Card.Content>
                  <Typography variant="body_short">
                    {entity?.description}
                    <Navigator
                      dataSourceId={dd}
                      documentId={di}
                      entity={entity}
                      onSelect={(node: TreeNode) => {
                        let id = node.nodeId
                        let root = false
                        if (node?.entity._id) {
                          id = `${node.dataSource}/${node.entity._id}`
                          root = true
                        }
                        setSelectedDocument(id)
                        const stack = [
                          ...elements,
                          {
                            name: node.name,
                            absoluteId: id,
                            root: root,
                            icon: <GetIcon node={node} />,
                            attribute: node.attribute,
                            home: false,
                            type: node.attributeData.attributeType,
                          },
                        ]
                        // @ts-ignore
                        setElements(stack)
                      }}
                    />
                  </Typography>
                </Card.Content>
                {true && (
                  <Card.Actions alignRight>
                    <Button variant="ghost_icon">
                      <Icon
                        name="settings"
                        title="settings action"
                        size={iconSize}
                      ></Icon>
                    </Button>
                    <Button variant="ghost_icon">
                      <Icon
                        name="save"
                        title="save action"
                        size={iconSize}
                      ></Icon>
                    </Button>
                  </Card.Actions>
                )}
              </Card>
            )}
          </>
        </Menu>
        <Content>
          <UIPluginSelector
            key={dd}
            absoluteDottedId={selectedDocument}
            entity={entity}
            // categories={['edit']}
            onOpen={handleOpen}
          />
        </Content>
      </Wrapper>
    </div>
  )
}
