export enum Status {
    STARTING = 'starting',
    RUNNING = 'running',
    FAILED = 'failed',
    COMPLETED = 'completed',
    UNKNOWN = 'unknown',
}

export enum Blueprints {
    BLUEPRINT = 'system/SIMOS/Blueprint',
    ANALYSIS = 'AnalysisPlatformDS/Blueprints/Analysis',
    BLOB = 'system/SIMOS/Blob',
    TASK = 'WorkflowDS/Blueprints/Task'
}
