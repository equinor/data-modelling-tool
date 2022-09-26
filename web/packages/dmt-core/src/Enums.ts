/**
 * An enum with paths to various blueprint types
 *
 * @docs Enums
 */
export enum EBlueprint {
  /** Path to the Blueprint blueprint */
  BLUEPRINT = 'system/SIMOS/Blueprint',
  /** Path to the BlueprintAttribute blueprint */
  ATTRIBUTE = 'system/SIMOS/BlueprintAttribute',
  /** Path to the Package blueprint */
  PACKAGE = 'system/SIMOS/Package',
  /** Path to the Entity blueprint */
  ENTITY = 'system/SIMOS/Entity',
  /** Path to the Enum blueprint */
  ENUM = 'system/SIMOS/Enum',
  /** Path to the Job blueprint */
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
