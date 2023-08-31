import io
import traceback

from common.app_utils.auth import Authorization
from common.config import REDIS_HOST, REDIS_PORT
from fastapi import APIRouter, Depends, UploadFile
from redis import Redis
from rq import Queue
from rq.job import Job
from rq.registry import StartedJobRegistry
from src.tasks import upload_files

router = APIRouter()


@router.post(
    "/upload",
    status_code=200,
    dependencies=[Depends(Authorization(role="admin"))],
)
async def upload(file: UploadFile):
    """Загрузка Zip файла"""
    contents = await file.read()
    bites = io.BytesIO(contents)
    q = Queue(connection=Redis(host=REDIS_HOST, port=int(REDIS_PORT)))
    job = q.enqueue(upload_files, bites, job_timeout=50000)
    return {"id": job.id}


@router.get(
    "/upload_log",
    status_code=200,
    dependencies=[Depends(Authorization(role="admin"))],
)
async def upload_log():
    """Возвращает статусы работы с файлом"""
    running_job_ids = []
    meta = {}
    try:
        redis = Redis(host=REDIS_HOST, port=int(REDIS_PORT))
        registry = StartedJobRegistry("default", connection=redis)
        running_job_ids = registry.get_job_ids()
        for job_id in running_job_ids:
            job = Job.fetch(job_id, connection=redis)
            if job.is_started:
                meta = job.get_meta(refresh=True)
                return meta
    except Exception as e:
        print("Error")
        print(e)
        print(traceback.format_exc())
    finally:
        return meta
