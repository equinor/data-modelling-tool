import {
  AuthContext,
  DmssAPI,
  DmtUIPlugin,
  GetIcon,
  Tree,
  TreeNode,
  UIPluginSelector,
} from '@dmt/common'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Icon, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import Breadcrumb from './Beadcrumb'
import {
  arrow_back,
  more_vertical,
  person_add,
  settings,
  share,
} from '@equinor/eds-icons'

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
  // @ts-ignore
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

        return (
          <NavigatorItem key={node.nodeId} onClick={handleSelect}>
            <Typography bold={!node?.attribute?.contained || false}>
              <>
                <GetIcon node={node} /> {node?.attribute?.name || node.name}
              </>
            </Typography>
          </NavigatorItem>
        )
      })}
    </>
  )
}

const NavigatorLinks = (props: any) => {
  const {
    entity,
    selectedDocumentDatasourceId,
    selectedDocumentId,
    setSelectedDocument,
    elements,
    setElements,
  } = props
  return (
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">{entity?.name}</Typography>
          <Typography variant="body_short"></Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant="body_short">
          {entity?.description}
          <Navigator
            dataSourceId={selectedDocumentDatasourceId}
            documentId={selectedDocumentId}
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
                  type: node?.attribute?.attributeType || '',
                },
              ]
              // @ts-ignore
              setElements(stack)
            }}
          />
        </Typography>
      </Card.Content>
      {false && (
        <Card.Actions alignRight>
          <Button variant="ghost_icon">
            <Icon
              name="settings"
              title="settings action"
              size={iconSize}
            ></Icon>
          </Button>
          <Button variant="ghost_icon">
            <Icon name="save" title="save action" size={iconSize}></Icon>
          </Button>
        </Card.Actions>
      )}
    </Card>
  )
}

const NavigatorBreadcrumbs = (props: any) => {
  const { setSelectedDocument, elements, setElements } = props

  const handleBack = () => {
    elements.pop()
    // @ts-ignore
    const active = elements[elements.length - 1]
    setSelectedDocument(active.absoluteId)
    setElements(elements)
  }

  if (elements.length <= 1) return <></>

  return (
    <Center>
      <Breadcrumb>
        {elements.map((element: any) => {
          const { name, absoluteId, attribute } = element
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
                    {element.icon}
                    <BreadcrumbLink>
                      {attribute?.name || name}{' '}
                      {element.root ? `(${element.name})` : ''}
                    </BreadcrumbLink>
                  </Typography>
                )}
              </div>
            </div>
          )
        })}
      </Breadcrumb>
      <Button variant="outlined" onClick={handleBack}>
        <Icon name="arrow_back" title="Go back" size={iconSize}></Icon> Back
      </Button>
    </Center>
  )
}

export const NavigatorContainer = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, config, document } = props
  // The first element is always the root document
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
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  // TODO: This is an experimental feature that might be enabled later
  const showNavigatorLinks = false

  // Everytime we change the selected document we need to fetch it
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

  const [
    selectedDocumentDatasourceId,
    selectedDocumentId,
  ] = selectedDocument.split('/', 2)

  const handleOpen = (props: any) => {
    const { entity, absoluteDottedId, attribute } = props

    let id = `${dataSourceId}/${documentId}.${attribute}`
    let root = false
    if (entity?._id) {
      id = absoluteDottedId
      root = true
    }
    setSelectedDocument(id)
    const stack = [
      ...elements,
      {
        name: entity.name || attribute,
        absoluteId: id,
        root: root,
        icon: null,
        attribute: attribute,
        home: false,
        type: entity.type,
      },
    ]
    // @ts-ignore
    setElements(stack)
  }

  return (
    <div>
      <Top>
        <NavigatorBreadcrumbs
          setSelectedDocument={setSelectedDocument}
          elements={elements}
          setElements={setElements}
        />
      </Top>
      <Wrapper>
        {showNavigatorLinks && (
          <Menu>
            <NavigatorLinks
              entity={entity}
              dd={selectedDocumentDatasourceId}
              di={selectedDocumentId}
              setSelectedDocument={setSelectedDocument}
              elements={elements}
              setElements={setElements}
            />
          </Menu>
        )}
        <Content>
          <UIPluginSelector
            key={selectedDocumentDatasourceId}
            absoluteDottedId={selectedDocument}
            entity={entity}
            onOpen={handleOpen}
            categories={['edit']}
          />
        </Content>
      </Wrapper>
    </div>
  )
}
