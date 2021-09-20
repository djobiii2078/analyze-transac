import { Icon } from '@iconify/react';
import bugFilled from '@iconify/icons-ant-design/bug-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 234;

export default function AppBugReports(params) {
  //Sum of transacs and transactions
  const [length,setLength] = useState(46);
  const [sum, setSum] = useState(0);

  useEffect( () => {
    async function renderVals(id,token){
       fetch('http://127.0.0.1:4000/transactions/count/'+id+'/EXPRESSUNION',{
          method : 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+token 
          }
         }).then(transacs => transacs.json())
         .then( transacs => {
            setSum(transacs[0].sum);
         })
      
      
    }
    renderVals(params.id,params.token);
  },[sum,length]);

  return (
    <RootStyle>
      <Typography variant="h2"> EU </Typography>
      <Typography variant="h3">{fShortenNumber(sum)}</Typography>
      <Typography variant="h4">{fShortenNumber(sum*0.13)} govt</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {length} Transactions
      </Typography>
    </RootStyle>
  );
}
