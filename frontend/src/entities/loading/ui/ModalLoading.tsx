import {Modal} from "@mui/material"
import Box from "@mui/material/Box";
import {Loading} from "./Loading";

export const ModalLoading = () => {
    return (
        <Modal open sx={{zIndex: '99999'}}>
            <Box>
                <Loading/>
            </Box>
        </Modal>
    )
}