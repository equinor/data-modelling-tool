export enum OperationStatus {
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  CONCLUDED = 'Concluded',
  UNKNOWN = 'Unknown',
}

export enum SimulationStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UNKNOWN = 'unknown',
}

export enum ACLEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  NONE = 'NONE',
}

export enum Blueprints {
  OPERATION = 'ForecastDS/FoR-BP/Blueprints/Operation',
  Comment = 'ForecastDS/FoR-BP/Blueprints/Comment',
  Comments = 'ForecastDS/FoR-BP/Blueprints/Comments',
  SIMULATION = 'ForecastDS/FoR-BP/Blueprints/Simulation',
  SIMULATION_CONFIG = 'ForecastDS/FoR-BP/Blueprints/SimulationConfig',
  VARIABLE = 'ForecastDS/FoR-BP/Blueprints/Variable',
  AZ_CONTAINER_JOB = 'DMT-Internal/DMT/AzureContainerInstanceJob',
  AZ_CONTAINER_JOB_CLASSIC = 'DMT-Internal/DMT/AzureContainerInstanceJobClassic',
  LOCAL_CONTAINER_JOB = 'DMT-Internal/DMT/Jobs/Container',
  AZ_CRON_CONTAINER_JOB_CLASSIC = 'DMT-Internal/DMT/CronAzureContainerInstanceJobClassic',
  LOCATION = 'ForecastDS/FoR-BP/Blueprints/Location',
  STASK = 'ForecastDS/FoR-BP/Blueprints/STask',
  CONFIG = 'ForecastDS/FoR-BP/Blueprints/Config',
  BLOB = 'system/SIMOS/Blob',
  PLOTSTATE = 'ForecastDS/FoR-BP/Blueprints/PlotState',
  GRAPH = 'ForecastDS/FoR-BP/Blueprints/Graph',
}
