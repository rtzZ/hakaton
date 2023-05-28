import io
import os

from fastapi import APIRouter, Depends, UploadFile
from redis import Redis
from rq import Queue, registry
from rq.job import Job
from rq.registry import StartedJobRegistry

from app_utils.auth import Authorization
from src.tasks import upload_files

router = APIRouter()


@router.post("/upload", status_code=200, dependencies=[Depends(Authorization(role='admin'))])
async def upload(file: UploadFile):
    """ Загрузка Zip файла """
    contents = await file.read()
    bites = io.BytesIO(contents)
    q = Queue(connection=Redis(host=os.environ.get('REDIS_HOST'), port=int(os.environ.get('REDIS_PORT'))))
    job = q.enqueue(upload_files, bites, job_timeout=50000)
    return {'id': job.id}


@router.get("/upload_log", status_code=200, dependencies=[Depends(Authorization(role='admin'))])
async def upload_log():
    """ Возвращает статусы работы с файлом """
    running_job_ids = []
    meta = {}
    try:
        redis = Redis(host=os.environ.get('REDIS_HOST'), port=int(os.environ.get('REDIS_PORT')))
        registry = StartedJobRegistry('default', connection=redis)
        running_job_ids = registry.get_job_ids()
        for job_id in running_job_ids:
            job = Job.fetch(job_id, connection=redis)
            if job.is_started:
                meta = job.get_meta(refresh=True)
                return meta
    finally:
        return meta
