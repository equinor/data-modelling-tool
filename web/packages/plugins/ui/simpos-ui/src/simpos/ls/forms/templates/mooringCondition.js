function makeTemplate() {
  var obj = {
    name: 'condition',
    description: '',
    type: 'app_mooring_db/simpos/mooringLS/positioning/Condition',
    label: 'Mooring Condition',
    brokenLines: {
      name: 'brokenLines',
      description:
        'A comma separated list of broken mooring line numbers, None: no broken line.',
      type: 'app_mooring_db/marmo/containers/SimpleString',
      label: 'Broken Lines',
      value: 'None',
    },
    lineNumbers: {
      name: 'lineNumbers',
      description:
        'A comma separated list of considered mooring line numbers, no space, e.g. 1,2-5,8: [1,2,3,4,5,8] .',
      type: 'app_mooring_db/marmo/containers/SimpleString',
      label: 'Lines Numbers',
      value: '1-2',
    },
  }

  return obj
}

export { makeTemplate as MakeMooringConditionTemplate }
