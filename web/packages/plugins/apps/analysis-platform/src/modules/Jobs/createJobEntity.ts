import {
  AZ_CONTAINER_JOB,
  AZ_CONTAINER_JOB_CRON,
  DEFAULT_DATASOURCE_ID,
  REVERSE_JOB,
  REVERSE_TASK,
  SHELL_JOB,
  SHELL_TASK,
  SIMA_TASK,
} from '../../const'
import { poorMansUUID } from '../../utils/uuid'

export function createJobEntity(task: any, referencedBy: string): any {
  switch (task.type) {
    case REVERSE_TASK:
      return {
        name: `${task.name}-${poorMansUUID()}`,
        type: task.jobType,
        outputTarget: 'AnalysisPlatformDS/Data/Results', // TODO: get from task
        resultLinkTarget: referencedBy,
        input: task.defaultInput,
      }
    case SIMA_TASK:
      const runRemote: string[] = task.remoteRun
        ? [
            '--remote-run',
            `--compute-service-cfg=${task.computeServiceConfigBlobId}`,
          ]
        : []
      // window.crypto.randomUUID() is not supported in firefox yet.
      let job = {
        name: poorMansUUID(),
        label: new Date().toLocaleString(navigator.language),
        type: AZ_CONTAINER_JOB,
        // type: Blueprints.LOCAL_CONTAINER_JOB, // For local testing
        image: 'publicMSA.azurecr.io/dmt-job/srs:latest',
        command: [
          '/code/init.sh',
          `--stask=${task.staskBlobId}`,
          `--task=${task}`,
          `--workflow=${task.workflow}`,
          `--input=${DEFAULT_DATASOURCE_ID}/${task.inputId}`,
          `--target=${task.targetFolder}`,
          `--result-link-target=${referencedBy}`,
          ...runRemote,
        ],
      }

      if (task.cronJob)
        job = {
          ...job,
          ...task.cronJob,
          type: AZ_CONTAINER_JOB_CRON,
        }

      return job
    case SHELL_TASK:
      return {
        type: SHELL_JOB,
        script: 'echo "Hello World"',
      }
  }
}
