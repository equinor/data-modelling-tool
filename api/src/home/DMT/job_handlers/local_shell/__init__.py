import os
import subprocess  # nosec
from typing import Tuple

from config import config
from services.dmss import dmss_api
from services.job_handler_interface import JobHandlerInterface, JobStatus
from utils.logging import logger

_SUPPORTED_TYPE = ("DMT-Internal/DMT/ShellJob", "DMT-Internal/DMT/CronShellJob")


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
        script_blob_id = self.job_entity["script"]["_blob_id"]
        with open("./script.sh", "wb") as file_hand:
            response = dmss_api.blob_get_by_id(self.data_source, script_blob_id)
            logger.info(f"Writing shell job to '{os.getcwd()}/script.sh'")
            file_hand.write(response.read())

        logger.info(f"JobId; '{self.job_entity['_id']}': Starting shell job.")
        shell_job_process = subprocess.run(
            args="bash ./script.sh",
            shell=True,
            check=True,
            capture_output=True,
        )
        logger.info(f"JobId; '{self.job_entity['_id']}': Shell job completed")
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
