from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Tuple


class JobStatus(Enum):
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
        stopped: datetime = datetime(1, 1, 1),
        result_id: str = None,
        log: str = None,
    ):
        self.job_id: str = job_id
        self.started: datetime = started
        self.status: JobStatus = status
        self.stopped: datetime = stopped
        self.result_id: str = result_id
        self.log: str = log

    def to_dict(self):
        return {
            "job_id": self.job_id,
            "started": self.started.isoformat(),
            "status": self.status.value,
            "stopped": self.stopped.isoformat(),
            "result_id": self.result_id,
            "log": self.log,
        }

    @classmethod
    def from_dict(cls, a_dict: dict):
        return Job(
            job_id=a_dict["job_id"],
            started=datetime.fromisoformat(a_dict["started"]),
            status=JobStatus(a_dict["status"]),
            stopped=datetime.fromisoformat(a_dict["stopped"]),
            result_id=a_dict.get("result_id"),
            log=a_dict.get("log"),
        )


class JobHandlerInterface(ABC):
    def __init__(self, data_source: str, job_entity: dict):
        self.data_source = data_source
        self.job_entity = job_entity

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
