// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
  ListTransacs
} from '../components/_dashboard/app';
import {SessionContext, getSessionCookie} from '../session';
import { useState, useEffect } from 'react';





// ----------------------------------------------------------------------


export default function DashboardApp() {
  const session = getSessionCookie();
  const id = JSON.parse(session).id;
  const token = JSON.parse(session).token;
  var [transacsByOps,setTransacsByOps] = useState([]);
  var [transacsByRegions,setTransacsByRegions] = useState([]);
  var [tcs,setTcs] = useState([]);

  console.log("token: "+token);
  const operators = ['CAMPOST','MTN','UBA','ORANGE','EXPRESSUNION']; //Should take it from a config file or database
  const regions = ['EXTREMENORD','NORD','ADAMAOUA','EST','CENTRE','SUD','LITTORAL','OUEST','NORDOUEST','SUDOUEST'];
  let transacsByOpsBis = [[],[],[],[],[]];
  let transacsByRegionsBis = [[],[],[],[],[],[],[],[],[],[]];
  let tcsBis = [];

  useEffect ( () => {
    async function getGraphics(){/*
      await fetch('http://127.0.0.1:4000/schools/mine?userId='+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
     })
      .then(schools => schools.json())
      .then(schools => {
          console.log("schools:" +JSON.stringify(schools));

          //Get schools ids
         fetch('http://127.0.0.1:4000/transactions/all/'+id,{
          method : 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+token 
          }
         }).then(transacs => transacs.json())
         .then( transacs => {
          setTcs(transacs);
          console.log("transacs:" +JSON.stringify(transacs));
          //Filter transacs by CAMPOST, MTN, UBA, ORANGE, EXPRESS UNION 
          for(var i=0; i<transacs.length; i++)
          {
              transacsByOpsBis[operators.indexOf(transacs[i].operator)].push(transacs[i]);
              console.log(transacs[i].region);
              transacsByRegionsBis[regions.indexOf(transacs[i].region)].push(transacs[i]);
          }
          
          setTransacsByOps(transacsByOpsBis);

          setTransacsByRegions(transacsByRegionsBis);

          transacsByOps = transacsByOpsBis;
          transacsByRegions =  transacsByRegionsBis;
       

          console.log("transacs0"+transacsByOps[0]);

        })
       });*/
    }
    getGraphics();
     
    },[]);
 

           return (
    <Page title="TRANSAC-CM">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">TABLEAU DE BORD </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales id={id} token={token}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers id={id} token={token}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders id={id} token={token}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports id={id} token={token}/>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits id={id} token={token}/>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits id={id} token={token}/>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppConversionRates transacs={transacsByOps}/>
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <ListTransacs id={id} token={token}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );

}
