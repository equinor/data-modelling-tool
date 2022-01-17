import React, { useContext, useState } from 'react'
import { Button, Progress, TextField } from '@equinor/eds-core-react'
import { AuthContext } from '@dmt/common'
import { Blueprints, OperationStatus } from '../Enums'
import { addToPath } from '../utils/insertDocument'
import {
  ConfigsPackage,
  DEFAULT_DATASOURCE_ID,
  LocationPackage,
  OperationsLocation,
} from '../const'
import DateRangePicker from '../components/DateRangePicker'
import { Heading } from '../components/Design/Fonts'
import { TConfig, TLocation, TOperationMeta } from '../Types'
import SelectOperationConfig from '../components/Operations/SelectConfig'
import SelectOperationLocation from '../components/Operations/SelectLocation'
import { ClickableMap } from '../components/Map'
import SelectSTask from '../components/Operations/SelectSTask'
import styled from 'styled-components'
import SelectSIMACompute from '../components/Operations/SelectSIMACompute'
import { getUsername } from '../utils/auth'

const CreateOperationWrapper = styled.div`
  display: flex;
`

const MapWrapper = styled.div`
  width: 50%;
  padding-right: 40px;
  height: 650px;
`

const Wrapper = styled.div`
  padding-top: 20px;
`

const SelectOperationName = (props: {
  setOperationName: Function
}): JSX.Element => {
  const { setOperationName } = props
  return (
    <div style={{ maxWidth: '400px' }}>
      <Heading text="Name" variant="h4" />
      <TextField
        id="operationame"
        placeholder="Operation name"
        helperText="Provide the name of the operation to create"
        onChange={(event: any) => {
          setOperationName(event.target.value)
        }}
      />
    </div>
  )
}

/**
 * Create a new entity and return its Id, or retrieve the Id of an existing one
 * @param entity An entity of type TLocation | TConfig
 * @param isNew true if the Location needs to be created in DMSS
 * @param token The access token
 */
const getEntityId = (
  entity: TLocation | TConfig,
  token: string,
  isNew: boolean = false,
  path: string
): PromiseLike<string> => {
  if (isNew) {
    return addToPath(entity, token, [], DEFAULT_DATASOURCE_ID, path)
  } else {
    return new Promise((resolve: any) => {
      resolve(entity._id)
    })
  }
}

/**
 * Create a new Operation entity
 * @param operationName Name of the operation to create
 * @param operationLabel Friendly name of the operation
 * @param SIMACompute A File on the SIMA Compute format (.yaml)
 * @param stask An Stask File
 * @param dateRange An array of dates as [startDate, endDate]
 * @param location A Location entity
 * @param config An OperationConfig entity
 * @param token The access token
 * @param user The username of the authenticated user
 */
const createOperationEntity = (
  operationName: string,
  operationLabel: string,
  SIMACompute: File,
  stask: File,
  dateRange: Date[],
  location: TLocation,
  config: TConfig,
  token: string,
  user: string
): Promise<string> => {
  let body = {
    name: operationName,
    label: operationLabel,
    description: config.description,
    type: Blueprints.OPERATION,
    stask: {
      name: stask.name,
      type: Blueprints.BLOB,
    },
    creator: user,
    location: location,
    start: dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined,
    end: dateRange && dateRange[1] ? dateRange[1].toISOString() : undefined,
    status: OperationStatus.UPCOMING, // TODO: decide based on start attr? allow user to select?
    phases: config.phases,
    comments: {
      name: operationName,
      type: Blueprints.Comments,
      comments: [],
    },
  }
  if (SIMACompute)
    body.SIMAComputeConnectInfo = {
      name: SIMACompute.name,
      type: 'system/SIMOS/Blob',
    }
  return addToPath(
    body,
    token,
    [stask, SIMACompute || undefined],
    DEFAULT_DATASOURCE_ID,
    OperationsLocation
  )
}

const onClickCreate = (
  setLoading: Function,
  operationMeta: TOperationMeta,
  operationLocation: TLocation,
  operationConfig: TConfig,
  SIMACompute: File,
  stask: File,
  isNewEntity: { location: boolean; config: boolean },
  setError: Function,
  token: string,
  user: string
) => {
  setLoading(true)
  const getIds = []

  // Prepare the uncontained entities for the Operation
  operationLocation.type = Blueprints.LOCATION
  getIds.push(
    getEntityId(operationLocation, token, isNewEntity.location, LocationPackage)
  )

  if (operationConfig) {
    // Optional
    operationConfig.type = Blueprints.CONFIG
    getIds.push(
      getEntityId(operationConfig, token, isNewEntity.config, ConfigsPackage)
    )
  }

  const handleApiError = (error: any) => {
    // @ts-ignore
    setLoading(false)
    if (typeof error.json !== 'function') {
      setError(`An error occurred: ${error}`)
    }
    return error.json().then((response: any) => {
      setError(
        `An error occurred: ${
          response.message || response.detail || JSON.stringify(response)
        }`
      )
    })
  }

  setLoading(true)

  Promise.all(getIds)
    .then((documentIds: string[]) => {
      if (isNewEntity.location) operationLocation._id = documentIds[0]
      if (isNewEntity.config) operationConfig._id = documentIds[1]

      createOperationEntity(
        operationMeta.name,
        operationMeta.label,
        SIMACompute,
        stask,
        operationMeta.dateRange,
        operationLocation,
        operationConfig,
        token,
        user
      )
        .then((documentId) => {
          const newLocation = document.location.pathname.replace(
            'new',
            `${DEFAULT_DATASOURCE_ID}/${documentId}`
          )
          // @ts-ignore
          document.location = newLocation
          setLoading(false)
        })
        .catch((err: any) => {
          handleApiError(err)
        })
    })
    .catch((err: any) => {
      handleApiError(err)
    })
}

const OperationCreate = (): JSX.Element => {
  const { tokenData, token } = useContext(AuthContext)
  const user = getUsername(tokenData) || 'NoLogin'
  const [error, setError] = useState<string>()
  const [operationMeta, setOperationMeta] = useState<TOperationMeta>({
    name: '',
    label: '',
    dateRange: [],
  })
  //todo add option to create label for an operation
  const [isNewEntity, setIsNewEntity] = useState<{
    location: boolean
    config: boolean
  }>({ location: false, config: false })
  const [operationConfig, setOperationConfig] = useState<TConfig>()
  const [sTask, setSTask] = useState<File>()
  const [SIMACompute, setSIMACompute] = useState<File>()
  const [operationLocation, setOperationLocation] = useState<
    TLocation | undefined
  >()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mapClickPos, setMapClickPos] = useState<[number, number] | undefined>()
  const [isNewLocation, setIsNewLocation] = useState(false)
  // TODO: Add "Save as Draft" button?

  const storeAndCheckOperationConfig = (
    newOperationConfig: TConfig,
    filename: string
  ) => {
    //todo the type checking can be improved... required attributes is defined in the type TConfig.
    if (!newOperationConfig) {
      setError('Invalid operation config.')
    } else {
      const hasRequiredAttirbutes =
        'name' in newOperationConfig &&
        'simaVersion' in newOperationConfig &&
        'phases' in newOperationConfig
      if (newOperationConfig['type'] !== Blueprints.CONFIG) {
        setError(
          `The configuration file has wrong type attribute. The type must be ${Blueprints.CONFIG}`
        )
      } else if (hasRequiredAttirbutes) {
        setError(undefined)
        setOperationConfig(newOperationConfig)
      } else {
        setError(
          `Could not parse content of the configuration file ${filename}. Does the file have the required attributes 'name', 'simaVersion' and 'phases'?`
        )
      }
    }
  }

  const isValidOperationLocation = () => {
    if (
      operationLocation &&
      operationLocation.name !== '' &&
      operationLocation.lat &&
      operationLocation.long
    ) {
      return true
    } else {
      return false
    }
  }

  const isValidOperationMeta = () => {
    if (
      operationMeta &&
      operationMeta.name !== '' &&
      operationMeta.dateRange.length !== 0
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <CreateOperationWrapper>
        <div style={{ width: '50%' }}>
          <SelectOperationName
            setOperationName={(operationName: string) => {
              const format = new RegExp('^[A-Za-z0-9-_ ]+$')
              if (!format.test(operationName)) {
                setError(
                  'Invalid operation name! (you cannot have empty name or use any special characters).'
                )
              } else {
                setError(undefined)
                setOperationMeta({
                  ...operationMeta,
                  label: operationName,
                  name: operationName.replace(' ', '-'),
                })
              }
            }}
          />
          <Wrapper>
            <Heading text="Time period" variant="h4" />
            <DateRangePicker
              setDateRange={(dateRange: Date[]) => {
                setError(undefined)
                setOperationMeta({ ...operationMeta, dateRange: dateRange })
              }}
            />
          </Wrapper>
          <Wrapper>
            <SelectOperationConfig
              setOperationConfig={storeAndCheckOperationConfig}
              setIsNewConfig={(isNew: boolean) => {
                setError(undefined)
                setIsNewEntity({ ...isNewEntity, config: isNew })
              }}
              setError={setError}
            />
          </Wrapper>
          <Wrapper>
            <SelectSIMACompute
              setSIMAComputeConfig={setSIMACompute}
              setError={setError}
            />
          </Wrapper>
          <Wrapper>
            <SelectSTask setSTask={setSTask} />
          </Wrapper>
          <Wrapper>
            <SelectOperationLocation
              location={operationLocation}
              setLocation={setOperationLocation}
              setError={setError}
              setIsNewLocation={(isNew: boolean) => {
                setError(undefined)
                setIsNewLocation(isNew)
                setIsNewEntity({ ...isNewEntity, location: isNew })
              }}
              mapClickPos={mapClickPos}
            />
          </Wrapper>
          <div
            style={{
              paddingTop: '40px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={() => {
                onClickCreate(
                  setIsLoading,
                  operationMeta,
                  operationLocation,
                  operationConfig,
                  SIMACompute,
                  sTask,
                  isNewEntity,
                  setError,
                  token,
                  user
                )
              }}
              // SIMACompute is left out on purpose. It is optional
              disabled={
                !(
                  sTask &&
                  isValidOperationLocation() &&
                  isValidOperationMeta() &&
                  operationConfig &&
                  !error
                )
              }
            >
              {(isLoading && <Progress.Dots color="neutral" />) ||
                'Create operation'}
            </Button>
          </div>
          <Wrapper>
            {error && (
              <p style={{ color: 'red', paddingTop: '10px' }}>{error}</p>
            )}
          </Wrapper>
        </div>
        <MapWrapper>
          <ClickableMap
            location={operationLocation}
            zoom={5}
            setClickPos={setMapClickPos}
            disableClick={!isNewLocation}
          />
        </MapWrapper>
      </CreateOperationWrapper>
    </>
  )
}

export default OperationCreate
