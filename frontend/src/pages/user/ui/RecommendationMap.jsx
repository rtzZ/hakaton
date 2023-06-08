import {Map, Placemark, Clusterer} from '@pbe/react-yandex-maps';
import {PaperLayout} from "../../../shared/layout";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

const getBalloonContent = (recommendation) => {
    const unom = `recommendation/${recommendation.unom}`
    const layout = window.ymaps.templateLayoutFactory.createClass(
        `<table style="font-size: 1rem; width: max-content">
                <tbody>
                    <tr style="height: 30px"><td>Адрес</td><td style="width: 5px"/><td><a id="address" href=${unom}>${recommendation.address}<a></td></tr>
                    <tr style="height: 30px"><td>Рекомендуемый вид работы</td><td style="width: 10px"/><td>${recommendation.recommendation}</td></tr>
                    <tr style="height: 30px"><td>Год постройки</td><td style="width: 10px"/><td>${recommendation.col_756}</td></tr>
                    <tr style="height: 30px"><td>Количество квартир</td><td style="width: 10px"/><td>${recommendation.col_761}</td></tr>
                    <tr style="height: 30px"><td>Количество подъездов</td><td style="width: 10px"/><td>${recommendation.col_760}</td></tr>
                    <tr style="height: 30px"><td>Количество лифтов</td><td style="width: 10px"/><td>${recommendation.col_771}</td></tr>
                    <tr style="height: 30px"><td>Здание аварийное</td><td style="width: 10px"/><td>${recommendation.col_770}</td></tr>
                </tbody>
            </table>`, {
            build: function () {
                layout.superclass.build.call(this);
                const address = document.getElementById('address')

                address.addEventListener('click', e => {
                })
            }
        })

    return layout
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