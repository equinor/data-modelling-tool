function makeTemplate() {
  var obj = {
    name: 'environment',
    description: '',
    type: 'app_mooring_db/simpos/rao/env/Environment',
    label: 'Enviromental Condition',
    wave: {
      name: 'wave',
      description: '',
      type: 'app_mooring_db/simpos/rao/env/Wave',
      label: 'Wave',
      significantWaveHeight: {
        name: 'significantWaveHeight',
        description: 'Significant wave height in [m].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 14.687,
        label: 'Significant Wave Height [m]',
        unit: 'm',
      },
      peakPeriod: {
        name: 'peakPeriod',
        description: 'Peak period in [s].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 17.243,
        label: 'Peak Period [s]',
        unit: 's',
      },
      waveDirection: {
        name: 'waveDirection',
        description: 'Wave propagation direction -comming from- in [deg].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 330,
        label: 'Wave Direction [deg]',
        unit: 'deg',
      },
    },
    wind: {
      name: 'wind',
      description: '',
      type: 'app_mooring_db/simpos/rao/env/Wind',
      label: 'Wind',
      windDirection: {
        name: 'windDirection',
        description: 'Wind direction -comming from- in [deg].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 330,
        label: 'Wind Direction [deg]',
        unit: 'deg',
      },
      windVelocity: {
        name: 'windVelocity',
        description:
          'Average wind speed 10[m] above mean water surface in [m/s].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 31.73,
        label: 'Wind Velocity [m/s]',
        unit: 'm/s',
      },
    },
    current: {
      name: 'current',
      description: '',
      type: 'app_mooring_db/simpos/rao/env/Current',
      label: 'Current',
      currentDepths: {
        name: 'currentDepths',
        description: 'A list of current levels, positive downward, in [m].',
        type: 'app_mooring_db/marmo/containers/SimpleString',
        label: 'Current Depths [m]',
        value: '0.0,-50,-150,-297,-300',
      },
      currentDirection: {
        name: 'currentDirection',
        description: 'Current direction -going to- in [deg].',
        type: 'app_mooring_db/marmo/containers/DimensionalScalar',
        value: 330,
        label: 'Current Direction [deg]',
        unit: 'deg',
      },
      currentVelocities: {
        name: 'currentVelocities',
        description: 'A list of current velocities at dfferent levels [m/s].',
        type: 'app_mooring_db/marmo/containers/SimpleString',
        label: 'Current Velocities [m/s]',
        value: '0.826, 0.504, 0.344, 0.244, 0.0',
      },
    },
  }

  return obj
}

export { makeTemplate as MakeEnvTemplate }
