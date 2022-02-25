import os
import subprocess  # nosec
from typing import Tuple

from config import config
from services.job_handler_interface import JobHandlerInterface, JobStatus
from utils.logging import logger

_SUPPORTED_TYPE = "WorkflowDS/Blueprints/jobs/Shell"


class JobHandler(JobHandlerInterface):
    """
    WARNING: Only for local and testing purposes. Pulling and executing a user provided shell script is a bad idea.
    Run a job of the 'DMT-Internal/DMT/ShellJob'-type in the local shell.
    """

    def __init__(self, data_source: str, job_entity: dict, token: str):
        super().__init__(data_source, job_entity, token)

    def start(self) -> str:
        if config.ENVIRONMENT != "local":
            raise Exception("Shell jobs can only be run in a local environment due to their unsecure nature")

        with open("./script.sh", "w") as file_hand:
            script = self.job_entity["script"]
            logger.info(f"Writing shell job to '{os.getcwd()}/script.sh'")
            file_hand.write(script)

        # logger.info(f"JobId; '{self.job_entity['_id']}': Starting shell job.")
        shell_job_process = subprocess.run(
            args="bash ./script.sh",
            shell=True,
            check=True,
            capture_output=True,
        )
        # logger.info(f"JobId; '{self.job_entity['_id']}': Shell job completed")
        output = shell_job_process.stdout.decode()
        logger.info(f"ShellJob completed successfully. \n {output}")
        return output

    def remove(self) -> str:
        """Terminate and cleanup all job related resources"""
        try:
            os.remove("./script.sh")
        except FileNotFoundError:
            pass
        return JobStatus.UNKNOWN, "Local shell job removed"

    def progress(self) -> Tuple[JobStatus, str]:
        """Poll progress from the job instance"""
        return JobStatus.UNKNOWN, "Shell jobs does not support progress polling"
