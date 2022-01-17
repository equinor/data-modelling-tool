import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext, useDocument } from '@dmt/common'
import { Progress, Tabs, Typography } from '@equinor/eds-core-react'
import { TOperation, TPhase } from '../Types'
import OperationDetails from '../components/Operations/OperationDetails'
import PhaseView from '../components/Operations/PhaseView'
import { hasExpertRole } from '../utils/auth'
import OperatorPhaseView from '../components/Operations/OperatorPhaseView'

export default (): JSX.Element => {
  const { data_source, entity_id } = useParams()
  const [loadingNewSimulation, setLoadingNewSimulation] = useState<boolean>(
    false
  )
  const [document, isLoading, updateDocument, error] = useDocument(
    data_source,
    entity_id
  )
  const [activeTab, setActiveTab] = useState<number>(0)
  const [phases, setPhases] = useState<TPhase[]>([])
  const { tokenData } = useContext(AuthContext)
  const operation: TOperation = document

  useEffect(() => {
    if (!document) return
    setPhases(document.phases || [])
  }, [document])

  if (error) {
    console.error(error.message)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch the document. {error.message}.
      </div>
    )
  }
  if (!document) return <>Loading...</>

  return (
    <>
      <Typography variant="body_long">{operation.name}</Typography>
      <Tabs
        activeTab={activeTab}
        onChange={(index: number) => setActiveTab(index)}
        variant="fullWidth"
      >
        <Tabs.List>
          <Tabs.Tab>Information</Tabs.Tab>
          {phases.length ? (
            phases.map((phase: TPhase) => (
              <Tabs.Tab key={phase.name}>{phase.name}</Tabs.Tab>
            ))
          ) : (
            <div />
          )}
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <OperationDetails
              operation={operation}
              setActiveTab={setActiveTab}
            />
          </Tabs.Panel>
          {phases.length ? (
            phases.map((phase: TPhase, index: number) => (
              <Tabs.Panel key={phase.name}>
                {hasExpertRole(tokenData) ? (
                  <PhaseView
                    setLoading={setLoadingNewSimulation}
                    phase={phase}
                    dottedId={`${operation._id}.phases.${index}`}
                    stask={operation.stask}
                    configBlob={operation.SIMAComputeConnectInfo}
                  />
                ) : (
                  <OperatorPhaseView phase={phase} />
                )}
              </Tabs.Panel>
            ))
          ) : (
            <div />
          )}
        </Tabs.Panels>
      </Tabs>
      {loadingNewSimulation && (
        <Progress.Circular
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '50px',
          }}
        />
      )}
    </>
  )
}
