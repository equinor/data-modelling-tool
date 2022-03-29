from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Tuple


class JobStatus(Enum):
    REGISTERED = "registered"
    STARTING = "starting"
    WAITING = "Waiting"  # todo the api fails if this is not included... cannot understand why
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

    def update_entity_attributes(self):
        # These attributes are common amongst all Job entities
        self.entity["started"] = self.started.isoformat()
        self.entity["stopped"] = self.stopped.isoformat()
        self.entity["status"] = self.status.value

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
    def __init__(self, job: Job, data_source: str):
        self.job = job
        self.data_source = data_source

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
