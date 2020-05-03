import Head from 'next/head'
import {Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import c from "../public/login.module.css"

const useStyles = makeStyles((theme) => ({
    paper: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    }
}));


export default function Home() {
  

  return (
    <>
      <Head>
        <title>Cdedxt App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container component="main" style={{paddingTop:25, maxWidth:556}}>
      <CssBaseline />
      <div className={c.main}>
        <h1 className={c.title}>
          Welcome to <a href="https://nextjs.org">AuthAPI!</a>
        </h1>
        <Typography component="h1" variant="h5" style={{fontSize: "1.65rem"}}>
          Log In
        </Typography>
        <form noValidate className={c.form} >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>

          </Grid>
          <Button type="submit" fullWidth  variant="contained" color="primary" style={{margin:"24px 0 16px"}}>
            Sign Ups
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" style={{fontSize:".97rem"}}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

</Container>

    </>
  )
}
