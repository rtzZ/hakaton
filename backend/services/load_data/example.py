import asyncio

import requests
from decimal import Decimal

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from settings.database import get_session, database
from src.models import Building



if __name__ == '__main__':


    # API KEYS
    # bc9df5fd-2afd-47ca-8f44-28d900431e05
    # 04e08168-b751-4d2c-8be5-ca7715e9b152
    # 58ad7bac-c76c-427e-8b27-23a1e68c2ab8

    # 58ad7bac-c76c-427e-8b27-23a1e68c2ab8

    resp = requests.get('https://geocode-maps.yandex.ru/1.x?apikey=bc9df5fd-2afd-47ca-8f44-28d900431e05'
                        '&geocode=Россия, Москва Кусковская ул., д.23, к.1'
                        '&format=json')
    # resp = requests.get('https://geocode-maps.yandex.ru/1.x?apikey=bc9df5fd-2afd-47ca-8f44-28d900431e05'
    #                     '&geocode=Москва,+Тверская+улица,+дом+7'
    #                     '&format=json')
    print(resp)
    # /response/GeoObjectCollection/featureMember/0/GeoObject/Point/pos
    pos = resp.json().get('response').get('GeoObjectCollection').get('featureMember')[0].get('GeoObject').get('Point').get('pos').split(' ')
    pos = f"{pos[1]},{pos[0]}"
    print(pos)