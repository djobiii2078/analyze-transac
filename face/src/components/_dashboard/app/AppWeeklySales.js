import { Icon } from '@iconify/react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
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
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;


export default function AppWeeklySales(params) {

  const [length,setLength] = useState(76);
  var [sum, setSum] = useState(0);

  useEffect( () => {
    async function renderVals(id,token){
       fetch('http://127.0.0.1:4000/transactions/count/'+id+'/MTN',{
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
      <Typography variant="h2"> CAMPOST </Typography>
      <Typography variant="h3">{fShortenNumber(sum)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {length} transactions
      </Typography>
    </RootStyle>
  );
}
