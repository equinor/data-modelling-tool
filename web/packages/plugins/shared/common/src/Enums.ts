export enum EBlueprint {
  BLUEPRINT = 'system/SIMOS/Blueprint',
  ATTRIBUTE = 'system/SIMOS/BlueprintAttribute',
  PACKAGE = 'system/SIMOS/Package',
  ENTITY = 'system/SIMOS/Entity',
  ENUM = 'system/SIMOS/Enum',
  JOB = 'WorkflowDS/Blueprints/Job',
}

export enum EJobStatus {
  CREATED = 'created',
  STARTING = 'starting',
  RUNNING = 'running',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UNKNOWN = 'unknown',
}
