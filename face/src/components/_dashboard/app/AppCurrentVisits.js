import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

const CHART_DATA = [4344, 5435, 1443, 4443];

export default function AppCurrentVisits(params) {
  const theme = useTheme();

  const [sumsperops,setSumsperops] = useState(CHART_DATA);

  useEffect(() => {
      async function rendervals(id,token){
         let transacsByOpsBis = [[],[],[],[],[]];
     const operators = ['CAMPOST','MTN','UBA','ORANGE','EXPRESSUNION'];
    fetch('http://127.0.0.1:4000/schools/mine?userId='+id, {
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
          //Filter transacs by CAMPOST, MTN, UBA, ORANGE, EXPRESS UNION 
          for(var i=0; i<transacs.length; i++)
          {
              transacsByOpsBis[operators.indexOf(transacs[i].operator)].push(transacs[i]);
          }

          var tabli = [0,0,0,0];


        var tabli = transacsByOpsBis.map(function(opsdata){
          var sum = 0;
          for(var i=0; i<opsdata.length;i++){
            sum = sum + parseFloat(opsdata[i].value);
          }
          return sum;
        });

        setSumsperops(tabli);
      });

        });
    }

      rendervals(params.id,params.token);
  },[sumsperops]);


  const chartOptions = /*merge(BaseOptionChart(),*/ {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    labels: ['CAMPOST', 'MTN', 'ORANGE','UBA', 'EXPRESS UNION'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  }/*);*/

  return (
    <Card>
      <CardHeader title="REPARTITION PAR OPERATEUR" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={sumsperops} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
