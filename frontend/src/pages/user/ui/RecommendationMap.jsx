import {useCallback, useRef} from "react";

import {Map, ObjectManager, Placemark, Clusterer} from '@pbe/react-yandex-maps';
import {PaperLayout} from "../../../shared/layout";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

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

    const getBalloonContent = (recommendation, link) => {
        return (
            `<text><b><a href='https://yandex.ru'>${recommendation}</a></b></text>`
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
                                                    balloonContent: '<div id="driver-2" class="driver-card">123</div>',
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