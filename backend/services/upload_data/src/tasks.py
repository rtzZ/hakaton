import io
from zipfile import ZipFile

from rq import get_current_job
from src.service.load_data import start


async def upload_files(bites: io.BytesIO):
    """Переодическая задача, разбор архива и вызов парсинга"""
    job = get_current_job()
    # Загрузка файлов
    job.meta["stage"] = "init_files"
    job.save_meta()
    files = {}
    with ZipFile(bites, "r") as zip_file:
        for xlxs_file in zip_file.filelist:
            if "__MACOSX" not in xlxs_file.filename:
                files[xlxs_file.filename] = zip_file.open(
                    xlxs_file.filename
                ).read()

    start(files)
