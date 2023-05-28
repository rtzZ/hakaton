""" Параметры """

params = [
    {
        'filename': '5.xlsx',
        'table_name': 'stg_event_system',
        'key_id': 'id',
    },
    {
        'filename': '4.1.xlsx',
        'table_name': 'stg_work_type_common',
        'key_id': 'id',
    },
    {
        'filename': '4.xlsx',
        'table_name': 'stg_work_type',
        'key_id': 'id',
        'skip_rows': 1,
        'columns': {
            '№\nп/п': 'id',
            'Код': 'code',
            'Наименование': 'name',
            'Наименование объекта общего имущества': 'name_common',
            'Тип работ': 'work_type',
            'Группа работ': 'work_group',
            'Сокращенное наименование работы': 'work_short_name',
        }
    },
    {
        'filename': '3.xlsx',
        'table_name': 'stg_work',
        'key_id': 'global_id',
        'date_correct': {
            'pattern': '%d.%m.%Y',
            'columns': (
                'plan_date_start',
                'plan_date_end',
                'fact_date_start',
                'fact_date_end',
            )
        }
    },
    {
        'filename': '2.xlsx',
        'table_name': 'stg_incident',
        'key_id': 'date_completed',
        'type_id': 'datetime64[ns]',
        'columns': {
            'Наименование': 'name',
            'Источник': 'source',
            'Дата создания во внешней системе': 'date_ext_created',
            'Дата закрытия': 'date_completed',
            'Округ': 'district',
            'Адрес': 'address',
            'Дата и время завершения события во': 'date_ext_completed',
        },

    },
]
