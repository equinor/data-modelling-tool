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
  var node = undefined

  if (snode.type.includes('sima/workflow/WorkflowInput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(0,192,255)',
    })
    console.log(snode)
    node.setPosition(snode.x, snode.y)
    let port = node.addOutPort('')
    ports[snode.outputSlot[idFlag]] = port
  } else if (snode.type.includes('sima/workflow/WorkflowOutput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(192,255,0)',
    })
    node.setPosition(snode.x, snode.y)
    let port = node.addInPort('')
    ports[snode.inputSlot[idFlag]] = port
  } else if (snode.type.includes('sima/workflow/RealNumberInput')) {
    node = new DefaultNodeModel({
      name: snode.name,
      color: 'rgb(192,192,0)',
    })
    node.setPosition(snode.x, snode.y)

    let portName = snode.array
      ? JSON.stringify(snode.values)
      : snode.value.toString()
    let port = node.addOutPort(portName)
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
    let portout = node.addOutPort('o')
    let portin = node.addInPort('i')

    ports[snode.filterOutputSlots[0][idFlag]] = portout
    ports[snode.filterInputSlots[0][idFlag]] = portin
  } else if (snode.type.includes('sima/workflow/WorkflowSetNode')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name + '[loop]' : 'Workflow Set',
      color: 'rgb(100,100,255)',
    })
    node.setPosition(snode.x, snode.y)

    for (var ind = 0; ind < snode.workflowOutputSlots.length; ind++) {
      let sport = snode.workflowOutputSlots[ind]
      let port = node.addOutPort(sport.name)
      ports[sport[idFlag]] = port
    }

    for (var ind = 0; ind < snode.workflowInputSlots.length; ind++) {
      let sport = snode.workflowInputSlots[ind]
      let port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }

    if (snode.input == 'From input') {
      for (var ind = 0; ind < snode.variableInputSetSlots.length; ind++) {
        let sport = snode.variableInputSetSlots[ind]
        let port = node.addInPort(sport.name)
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
      let sport = snode.workflowOutputSlots[ind]
      let port = node.addOutPort(sport.name)
      ports[sport[idFlag]] = port
    }

    for (var ind = 0; ind < snode.workflowInputSlots.length; ind++) {
      let sport = snode.workflowInputSlots[ind]
      let port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }
  } else if (snode.type.includes('sima/workflow/ConditionInputNode')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name + '[SIMO]' : 'SIMO Condition',
      color: 'rgb(100,100,255)',
    })
    node.setPosition(snode.x, snode.y)

    let sport = snode.outputSlot
    let port = node.addOutPort(sport.name)
    ports[sport[idFlag]] = port

    for (var ind = 0; ind < snode.variableInputSlots.length; ind++) {
      let sport = snode.variableInputSlots[ind]
      let port = node.addInPort(sport.name)
      ports[sport[idFlag]] = port
    }
  } else if (snode.type.includes('sima/post/SignalSelectionOperation')) {
    node = new DefaultNodeModel({
      name: snode.name !== undefined ? snode.name : 'Select',
      color: 'rgb(100,150,255)',
    })
    node.setPosition(snode.x, snode.y)

    let sport = snode.inputSlot
    let port = node.addInPort(sport.name)
    ports[sport[idFlag]] = port

    for (var ind = 0; ind < snode.requirementOutputSlots.length; ind++) {
      let sport = snode.requirementOutputSlots[ind]
      var pname = ''
      if (sport.useQuery == false) {
        var filters = []
        for (var usi = 0; usi < sport.userRequirements.length; usi++) {
          filters.push(
            sport.userRequirements[usi].attribute +
              '=' +
              sport.userRequirements[usi].value
          )
        }
        pname = '[' + filters.join('&') + ']  ' + sport.name
      }
      let port = node.addOutPort(pname)
      ports[sport[idFlag]] = port
    }
  }
  return node
}

const makeLink = (slink: any, ports: any) => {
  var link = undefined

  let port1 = ports[slink.fromSlot[idFlag]]
  let port2 = ports[slink.toSlot[idFlag]]

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
  var engine = createEngine()

  //2) setup the diagram model
  var model = new DiagramModel()

  var nodes = []
  var ports = {}

  for (var i = 0; i < document.nodes.length; i++) {
    var node = makeNode(document.nodes[i], ports)
    if (node != undefined) {
      nodes.push(node)
      model.addAll(node)
    }
  }

  for (var i = 0; i < document.connections.length; i++) {
    var link = makeLink(document.connections[i], ports)
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
