from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Tuple


class JobStatus(Enum):
    REGISTERED = "registered"
    STARTING = "starting"
    RUNNING = "running"
    FAILED = "failed"
    COMPLETED = "completed"
    UNKNOWN = "unknown"


class Job:
    def __init__(
        self,
        job_id: str,
        started: datetime,
        status: JobStatus,
        entity: dict,
        stopped: datetime = datetime(1, 1, 1),
        log: str = None,
        cron_job: bool = False,
        token: str = None,
    ):
        self.job_id: str = job_id
        self.started: datetime = started
        self.status: JobStatus = status
        self.entity: dict = entity
        self.stopped: datetime = stopped
        self.log: str = log
        self.cron_job: bool = cron_job
        self.token: str = token

    def to_dict(self):
        return {
            "job_id": self.job_id,
            "started": self.started.isoformat(),
            "status": self.status.value,
            "entity": self.entity,
            "stopped": self.stopped.isoformat(),
            "log": self.log,
            "cron_job": self.cron_job,
            "token": self.token,
        }

    @classmethod
    def from_dict(cls, a_dict: dict):
        return Job(
            job_id=a_dict["job_id"],
            started=datetime.fromisoformat(a_dict["started"]),
            status=JobStatus(a_dict["status"]),
            entity=a_dict["entity"],
            stopped=datetime.fromisoformat(a_dict["stopped"]),
            log=a_dict.get("log"),
            cron_job=a_dict.get("cron_job"),
            token=a_dict.get("token"),
        )


class JobHandlerInterface(ABC):
    def __init__(self, data_source: str, job_entity: dict, token: str):
        self.data_source = data_source
        self.job_entity = job_entity
        self.token = token

    @abstractmethod
    def start(self) -> str:
        """Run or deploy a job or job service"""

    @abstractmethod
    def remove(self) -> str:
        """Terminate and cleanup all job related resources"""

    @abstractmethod
    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""


class ServiceJobHandlerInterface(JobHandlerInterface):
    @abstractmethod
    def setup_service(self, service_id: str) -> str:
        """Start a persistent service"""

    @abstractmethod
    def teardown_service(self, service_id: str) -> str:
        """Teardown and cleanup a persistent service"""


class ComputeResources(Enum):
    LOW = "low"
    HIGH = "high"
