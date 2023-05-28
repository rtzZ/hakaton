#### Работа с данными в БД Postgres 

0. Заполнить .env
1. Проинициализировать таблицы (stage, основные, models)
   Из модуля `load_data.py` вызвать методы:
   
   `execute_sql(sql_files.get('init_stage'))`

   `execute_sql(sql_files.get('init'))`
   
   `execute_sql(sql_files.get('init_model'))`
3. Проверить настройки `table_config.py`
4. Загрузить (догрузить) данные из файлов данные в область stage
   `load()`
5. Запустить процесс etl
   `execute_sql(sql_files.get('etl'))` 
