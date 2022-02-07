import { TCronJob, TJob } from '../../../Types'
import { Blueprints } from '../../../Enums'
import { poorMansUUID } from '../../../utils/uuid'
import {
  AzureContainerInstancesOmniaLogAnalyticsWorkspaceResourceId,
  AzureContainerInstancesOmniaSubnetId,
  DEFAULT_DATASOURCE_ID,
} from '../../../const'

export function createContainerJob(
  staskBlobId: string,
  task: string,
  workflow: string,
  inputId: string,
  targetFolder: string, //the folder to store result files
  remoteRun: boolean = false,
  resultLinkTarget: string,
  computeServiceConfigBlobId?: string,
  cronJob?: TCronJob
): TJob {
  const runRemote: string[] = remoteRun
    ? ['--remote-run', `--compute-service-cfg=${computeServiceConfigBlobId}`]
    : []
  // window.crypto.randomUUID() is not supported in firefox yet.
  let newSim = {
    name: poorMansUUID(),
    label: new Date().toLocaleString(navigator.language),
    type: Blueprints.AZ_CONTAINER_JOB_CLASSIC,
    // type: Blueprints.LOCAL_CONTAINER_JOB, // For local testing
    image: 'publicMSA.azurecr.io/dmt-job/srs:latest',
    command: [
      '/code/init.sh',
      `--stask=${staskBlobId}`,
      `--task=${task}`,
      `--workflow=${workflow}`,
      `--input=${DEFAULT_DATASOURCE_ID}/${inputId}`,
      `--target=${targetFolder}`,
      `--result-link-target=${resultLinkTarget}`,
      ...runRemote,
    ],
    subnetId: AzureContainerInstancesOmniaSubnetId,
    logAnalyticsWorkspaceResourceId: AzureContainerInstancesOmniaLogAnalyticsWorkspaceResourceId,
  }

  if (cronJob)
    newSim = {
      ...newSim,
      ...cronJob,
      type: Blueprints.AZ_CRON_CONTAINER_JOB_CLASSIC,
    }

  return newSim
}
