from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Tuple
from uuid import UUID, uuid4


class JobStatus(str, Enum):
    REGISTERED = "registered"
    STARTING = "starting"
    RUNNING = "running"
    FAILED = "failed"
    COMPLETED = "completed"
    REMOVED = "removed"
    UNKNOWN = "unknown"


class Job:
    def __init__(
        self,
        dmss_id: str,
        started: datetime,
        status: JobStatus,
        entity: dict,
        job_uid: UUID = uuid4(),
        stopped: datetime = datetime(1, 1, 1),
        log: str = None,
        cron_job: bool = False,
        token: str = None,
    ):
        self.dmss_id: str = dmss_id
        self.job_uid: UUID = job_uid
        self.started: datetime = started
        self.status: JobStatus = status
        self.entity: dict = entity
        self.stopped: datetime = stopped
        self.log: str = log
        self.cron_job: bool = cron_job
        self.token: str = token

    def update_entity_attributes(self):
        # These attributes are common amongst all Job entities
        self.entity["started"] = self.started.isoformat() + "Z"
        self.entity["stopped"] = self.stopped.isoformat() + "Z"
        self.entity["status"] = self.status.value
        self.entity["uid"] = str(self.job_uid)

    def to_dict(self):
        return {
            "job_uid": str(self.job_uid),
            "dmss_id": self.dmss_id,
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
            dmss_id=a_dict["dmss_id"],
            job_uid=UUID(a_dict["job_uid"]),
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

    def remove(self) -> str:
        """Terminate and cleanup all job related resources"""
        raise NotImplementedError

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        raise NotImplementedError

    def result(self) -> Tuple[str, bytearray]:
        """Returns a string for free text and the result of the job as a bytearray"""
        raise NotImplementedError

    def setup_service(self, service_id: str) -> str:
        """Start a persistent service"""
        raise NotImplementedError

    def teardown_service(self, service_id: str) -> str:
        """Teardown and cleanup a persistent service"""
        raise NotImplementedError
