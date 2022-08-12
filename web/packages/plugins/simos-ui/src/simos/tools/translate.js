import { EntityParser } from '../../dmt/tools/EntityParser.js'

const parser = new EntityParser()

function translate(doc) {
  for (var propName in doc) {
    var prop = doc[propName]

    //console.log("parsing ... " + prop)

    if (parser.isArray(prop)) {
      for (var i = 0; i < prop.length; i++) {
        translate(prop[i])
      }

      //TODO: remove after fix in sima to read array of objects from json
      //replace arrays with fixed objects of attributes
      //this is to cope with sima deficiency
      //only valid for arrays on only objects
      if (parser.isObject(prop[0])) {
        var items = {}
        for (var ind = 0; ind < prop.length; ind++) {
          prop[ind].name = propName + '_' + (ind + 1)
          items[prop[ind].name] = prop[ind]
        }

        doc[propName] = items
      }
    } else if (parser.isObject(prop)) {
      //console.log("reading ... " + prop.name)

      prop.type = parser.translateType(prop)
      translate(prop)
    } else {
      //do nothing
    }
  }
}

function entity_dmt_to_simos(document) {
  var simosDoc = JSON.parse(JSON.stringify(document))
  translate(simosDoc)

  return simosDoc
}

export { entity_dmt_to_simos as translate_entity_dmt_to_simos }
