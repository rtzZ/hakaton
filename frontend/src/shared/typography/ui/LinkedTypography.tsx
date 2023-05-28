import React from "react";
import { useTheme } from '@mui/material/styles';

import {Link} from "@mui/material";

import {VariantType} from "../types";

interface ILinkedTypography {
    variant?: VariantType;
    children?: React.ReactNode;
    href: string;
    sx?: {[x: string]: string};
    [x: string]: any;
}

export const LinkedTypography = ({variant, href, sx, children, ...props}: ILinkedTypography) => {
    const {palette} = useTheme()

    return (
        <Link
            href={href}
            variant={variant}
            underline='hover'
            sx={{
                color: palette.primary.main,
                ...sx
            }}
            {...props}
        >
            {children}
        </Link>
    );
}