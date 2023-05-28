import {useState} from "react";
import {
    Button,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";

function not(a: readonly any[], b: readonly any[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly any[], b: readonly any[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly any[], b: readonly any[]) {
    return [...a, ...not(b, a)];
}

interface ITransferList {
    leftHeader: string
    subHeaderLeft: string
    rightHeader: string
    subHeaderRight: string
    data: string[]
    right: readonly any[]
    sx: {[x: string]: any}
    setRight: (x: readonly any[]) => void
}

export const TransferList = ({data, right, setRight, leftHeader, rightHeader, subHeaderLeft, subHeaderRight, sx}: ITransferList) => {
    const [left, setLeft] = useState<readonly any[]>(not(data, right));
    const [checked, setChecked] = useState<readonly any[]>([]);


    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly number[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly number[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (header: string, subHeader: string, items: readonly number[]) => (
        <Card>
            <CardHeader
                sx={{px: 2, py: 1}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                    />
                }
                title={header}
                subheader={`${numberOfChecked(items)}/${items.length} ${subHeader}`}
            />
            <Divider/>
            <List
                sx={{
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: number) => {
                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={value}/>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{...sx}}>
            <Grid sx={{flexBasis: '45%'}} item>{customList(leftHeader, subHeaderLeft, left)}</Grid>
            <Grid item sx={{flexBasis: '10%'}}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{my: 0.5}}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid sx={{flexBasis: '45%'}} item>{customList(leftHeader, subHeaderRight, right)}</Grid>
        </Grid>
    );
}