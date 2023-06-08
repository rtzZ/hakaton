import {Map, Placemark, Clusterer} from '@pbe/react-yandex-maps';
import {PaperLayout} from "../../../shared/layout";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

const getBalloonContent = (recommendation) => {
    return window.ymaps.templateLayoutFactory.createClass(
        `<table style="font-size: 1.1rem; width: max-content">
                <tbody>
                    <tr style="height: 30px"><td style="margin-right: 10px">Адрес</td><td>${recommendation.address}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Рекомендуемый вид работы</td><td>${recommendation.recommendation}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Год постройки</td><td>${recommendation.col_756}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Количество квартир</td><td>${recommendation.col_761}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Количество подъездов</td><td>${recommendation.col_760}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Количество лифтов</td><td>${recommendation.col_771}</td></tr>
                    <tr style="height: 30px"><td style="margin-right: 10px">Здание аварийное</td><td>${recommendation.col_770}</td></tr>
                </tbody>
            </table>`, {})
}
export const RecommendationMap = ({recommendation}) => {

    const getHintContent = (address) => {
        return (
            `<PaperLayout elevation={3}>
                <Typography>
                    ${address}
                </Typography>
            </PaperLayout>`
        )
    }

    return (
        <PaperLayout elevation={3}>
            {
                !recommendation.length
                    ? <Typography>По данным фильтрам нет результатов</Typography>
                    : <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Map
                            defaultState={{
                                center: [55.820496, 37.81195],
                                zoom: 11,
                            }}
                            width='100%'
                            height='700px'>
                            <Clusterer
                                options={{
                                    preset: "islands#invertedVioletClusterIcons",
                                    groupByCoordinates: false,
                                }}
                            >
                                {
                                    recommendation.map(recommend => {
                                        const coordinates = recommend.soor.split(',')

                                        return <Placemark
                                            key={recommend.unom}
                                            geometry={[+coordinates[0], +coordinates[1]]}
                                            properties={
                                                {
                                                    hintContent: getHintContent(recommend.address),
                                                }}
                                            options={{
                                                balloonContentLayout: getBalloonContent(recommend)
                                            }}
                                            modules={
                                                ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                            }
                                        />
                                    })
                                }
                            </Clusterer>
                            {/*<ObjectManager*/}
                            {/*    options={{*/}
                            {/*        clusterize: true,*/}
                            {/*        gridSize: 32*/}
                            {/*    }}*/}
                            {/*    instanceRef={objectManagerRef}*/}
                            {/*    onClick={handleClick}*/}
                            {/*    objects={{*/}
                            {/*        openBalloonOnClick: true,*/}
                            {/*    }}*/}
                            {/*    defaultFeatures={features}*/}
                            {/*    modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}*/}
                            {/*/>*/}
                        </Map>
                    </Box>
            }
        </PaperLayout>
    )
}