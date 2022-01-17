import { Button, Container, makeStyles, TextField, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useStyle = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    newCar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(2)
    },
    details: {
        marginTop: theme.spacing(5)
    },
    para: {
        margin: theme.spacing(2),
    },
    datax: {
        color: 'green',
        marginLeft: theme.spacing(2)
    }
}));

type AstoridState = {
    name: string
    Nasa_jpl_url: string
    is_potentially_hazardous_asteroid: string
}
export const Home = () => {
    const [astoridId, setAstoridId] = useState<string>("");
    const [astoridDetails, setAstoridDetails] = useState<AstoridState | null>(null);
    const [data, setData] = useState<boolean>(false);
    const [randamAstoridId, setRandamAstoridId] = useState<number | null>(null);
    const [mount, setMount] = useState(false);
    const classes = useStyle();

    const searchAstoridId = async () => {
        try {
            const responce = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${astoridId}?api_key=1GJVd4dvUdtowCfangpoY09S9tFE4BnSF4GUjWB7`);
            setAstoridDetails({
                name: responce.data.name,
                Nasa_jpl_url: responce.data.nasa_jpl_url,
                is_potentially_hazardous_asteroid: JSON.stringify(responce.data.is_potentially_hazardous_asteroid)
            });
            setData(true);
            setAstoridId("");
        } catch (error) {
            console.log(error);
        }
    }

    const randomAstoridId = async () => {
        try {
            const responce = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=1GJVd4dvUdtowCfangpoY09S9tFE4BnSF4GUjWB7`);
            const randomValue = Math.floor((Math.random() * 20));
            setMount(true);
            setRandamAstoridId(responce.data.near_earth_objects[randomValue].id);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (mount) {
            axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${randamAstoridId}?api_key=1GJVd4dvUdtowCfangpoY09S9tFE4BnSF4GUjWB7`)
                .then((responce) => {
                    setAstoridDetails({
                        name: responce.data.name,
                        Nasa_jpl_url: responce.data.nasa_jpl_url,
                        is_potentially_hazardous_asteroid: JSON.stringify(responce.data.is_potentially_hazardous_asteroid)
                    });
                    setData(true)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        return () => {
            setMount(false);
        }
    }, [randamAstoridId])

    return (
        <Container className={classes.container}>
            <Typography component='div' className={classes.newCar}>
                <TextField id="standard-basic" label="Astorid-Id" value={astoridId} onChange={(e) => setAstoridId(e.target.value)} />
                <Button variant="contained" className={classes.button} color="primary" disabled={astoridId ? false : true} onClick={() => searchAstoridId()}>
                    Search Astorid
                </Button>
                <Button variant="contained" className={classes.button} color="primary" onClick={() => randomAstoridId()}>
                    Random Astorid
                </Button>
            </Typography>
            {
                data ?
                    <Typography component='div' className={classes.details}>
                        <Typography component='p' className={classes.para}>Name:
                            <Typography component='span' className={classes.datax}>{astoridDetails?.name}</Typography>
                        </Typography>
                        <Typography component='p' className={classes.para}>Nasa_jpl_url:
                            <Typography component='span' className={classes.datax}>{astoridDetails?.Nasa_jpl_url}</Typography>
                        </Typography>
                        <Typography>is_potentially_hazardous_asteroid:
                            <Typography component='span' className={classes.datax}>{astoridDetails?.is_potentially_hazardous_asteroid}</Typography>
                        </Typography>
                    </Typography >
                    : ""
            }
        </Container >
    )
}
