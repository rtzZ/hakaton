import {Map, Placemark} from '@pbe/react-yandex-maps';
import {PaperLayout} from "../../../shared/layout";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

export const RecommendationMap = ({recommendation}) => {
    // const center = recommendation[0]?.soor?.split(',') || [55.75, 37.57]

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
                            {
                                recommendation.map(recommend => {
                                    const coordinates = recommend.soor.split(',')

                                    return <Placemark
                                        key={recommend.unom}
                                        geometry={[+coordinates[0], +coordinates[1]]}
                                        properties={
                                            {
                                                hintContent: `<Typography>${recommend.address}</Typography>`,
                                                balloonContent: '<div id="driver-2" class="driver-card"></div>',
                                            }}
                                        modules={
                                            ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                        }
                                    />
                                })
                            }
                        </Map>
                    </Box>
            }
        </PaperLayout>
    )
}