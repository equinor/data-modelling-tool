import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultDiagramState,
} from '@projectstorm/react-diagrams'
import * as React from 'react'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget'

const idFlag = '__id'

const makeNode = (snode: any, ports: any) => {
  let node = undefined

  if (snode.type.includes('sima/workflow/WorkflowInput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(0,192,255)',
    })
    console.log(snode)
    node.setPosition(snode.x, snode.y)
    const port = node.addOutPort('')
    ports[snode.outputSlot[idFlag]] = port
  } else if (snode.type.includes('sima/workflow/WorkflowOutput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(192,255,0)',
    })
    node.setPosition(snode.x, snode.y)
    const port = node.addInPort('')
    ports[snode.inputSlot[idFlag]] = port
  } else if (snode.type.includes('sima/workflow/RealNumberInput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(192,192,0)',
    })
    node.setPosition(snode.x, snode.y)

    const portName = snode.array
      ? JSON.stringify(snode.values)
      : snode.value.toString()
    const port = node.addOutPort(portName)
    ports[snode.outputSlot[idFlag]] = port
  } else if (snode.type.includes('sima/post/AddConstantFilter')) {
    let nodeName =
      snode.constant < 0
        ? snode.constant.toString()
        : '+' + snode.constant.toString()
    if (snode.axis == 'X-Axis') {
      nodeName = nodeName + '[X]'
    }
    node = new DefaultNodeModel({
      name: nodeName,
      color: 'rgb(192,155,0)',
    })
    node.setPosition(snode.x, snode.y)
    const portout = node.addOutPort('o')
    const portin = node.addInPort('i')

    ports[snode.filterOutputSlots[0][idFlag]] = portout
    ports[snode.filterInputSlots[0][idFlag]] = portin
  } else if (snode.type.includes('sima/workflow/WorkflowSetNode')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name + '[loop]' : 'Workflow Set',
      color: 'rgb(100,100,255)',
    })
    node.setPosition(snode.x, snode.y)

    for (var ind = 0; ind < snode.workflowOutputSlots.length; ind++) {
      const sport = snode.workflowOutputSlots[ind]
      const port = node.addOutPort(sport.name)
      ports[sport[idFlag]] = port
    }

    for (var ind = 0; ind < snode.workflowInputSlots.length; ind++) {
      const sport = snode.workflowInputSlots[ind]
      const port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }

    if (snode.input == 'From input') {
      for (var ind = 0; ind < snode.variableInputSetSlots.length; ind++) {
        const sport = snode.variableInputSetSlots[ind]
        const port = node.addInPort(sport.name)
        ports[sport[idFlag]] = port
      }
    }
  } else if (snode.type.includes('sima/workflow/WorkflowReferenceNode')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name : 'Workflow',
      color: 'rgb(100,100,255)',
    })
    node.setPosition(snode.x, snode.y)

    for (var ind = 0; ind < snode.workflowOutputSlots.length; ind++) {
      const sport = snode.workflowOutputSlots[ind]
      const port = node.addOutPort(sport.name)
      ports[sport[idFlag]] = port
    }

    for (var ind = 0; ind < snode.workflowInputSlots.length; ind++) {
      const sport = snode.workflowInputSlots[ind]
      const port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }
  } else if (snode.type.includes('sima/workflow/ConditionInputNode')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name + '[SIMO]' : 'SIMO Condition',
      color: 'rgb(100,100,255)',
    })
    node.setPosition(snode.x, snode.y)

    const sport = snode.outputSlot
    const port = node.addOutPort(sport.name)
    ports[sport[idFlag]] = port

    for (var ind = 0; ind < snode.variableInputSlots.length; ind++) {
      const sport = snode.variableInputSlots[ind]
      const port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }
  } else if (snode.type.includes('sima/post/SignalSelectionOperation')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name : 'Select',
      color: 'rgb(100,150,255)',
    })
    node.setPosition(snode.x, snode.y)

    const sport = snode.inputSlot
    const port = node.addInPort(sport.name)
    ports[sport[idFlag]] = port

    for (var ind = 0; ind < snode.requirementOutputSlots.length; ind++) {
      const sport = snode.requirementOutputSlots[ind]
      let pname = ''
      if (sport.useQuery == false) {
        const filters = []
        for (let usi = 0; usi < sport.userRequirements.length; usi++) {
          filters.push(
            sport.userRequirements[usi].attribute +
              '=' +
              sport.userRequirements[usi].value
          )
        }
        pname = '[' + filters.join('&') + ']  ' + sport.name
      }
      const port = node.addOutPort(pname)
      ports[sport[idFlag]] = port
    }
  }
  return node
}

const makeLink = (slink: any, ports: any) => {
  let link = undefined

  const port1 = ports[slink.fromSlot[idFlag]]
  const port2 = ports[slink.toSlot[idFlag]]

  try {
    link = port1.link(port2)
  } catch (err) {
    return link
  }
  //link.getOptions().testName = 'Test';
  //link.addLabel('');

  return link
}

const MakeDiagram = ({ document }: any) => {
  console.log(document)

  //1) setup the diagram engine
  const engine = createEngine()

  //2) setup the diagram model
  const model = new DiagramModel()

  const nodes = []
  const ports = {}

  for (var i = 0; i < document.nodes.length; i++) {
    const node = makeNode(document.nodes[i], ports)
    if (node != undefined) {
      nodes.push(node)
      model.addAll(node)
    }
  }

  for (var i = 0; i < document.connections.length; i++) {
    const link = makeLink(document.connections[i], ports)
    if (link != undefined) {
      model.addAll(link)
    }
  }

  console.log(ports)

  //5) load model into engine
  engine.setModel(model)
  //			<button onClick={engine.zoomToFit()}>Zoom To Fit </button>

  //6) render the diagram!
  return (
    <DemoCanvasWidget>
      <CanvasWidget engine={engine} />
    </DemoCanvasWidget>
  )
}

export { MakeDiagram as MakeDiagram }
