import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Express Union',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  },
  {
    name: 'MTN Mobile Money',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
  },
  {
    name: 'Orange Mobile Money',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
  }
];

function groupday(value, index, array){
   let byday={};
    let d = new Date(value['timestamp']);
    d = Math.floor(d.getTime()/(1000*60*60*24));
    byday[d]=byday[d]||0.0;
    byday[d]=byday[d]+parseFloat(value.value);
  return byday;
}

function groupweek(value, index, array){
  let byweek={};
   let d = new Date(value['timestamp']);
    d = Math.floor(d.getTime()/(1000*60*60*24*7));
    byweek[d]=byweek[d]||0.0;
    byweek[d]=byweek[d]+parseFloat(value.value);
  return byweek;
}

function groupmonth(value, index, array){
   let bymonth={};
    let d = new Date(value['timestamp']);
    d = (d.getFullYear()-1970)*12 + d.getMonth();
    bymonth[d]=bymonth[d]||0.0;
    bymonth[d]=bymonth[d]+parseFloat(value.value);
  return bymonth;
}

function groupyear(value, index, array){
   let byyear={};
    let d = new Date(value['timestamp']);
    d = d.getFullYear();
    byyear[d]=byyear[d]||0.0;
    byyear[d]=byyear[d]+parseFloat(value.value);
  return byyear;
}

const defaultOptions = /*merge(BaseOptionChart(),*/ {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: ['1','2','3','4','5','6','7','8','9','10','11'],
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} KFCFA`;
          }
          return y;
        }
      }
    }
  };/*);*/


export default function AppWebsiteVisits(params) {

  const [chartOptions, setChartOptions] = useState(defaultOptions);
  const [chartData, setChartData] = useState(CHART_DATA);
  //By default we plot for the 12 last months 
  // Else we can plot per year or
  // 7 last days

  //byDays = await transacs.map(groupday);
  //bymonth = await transacs.map(groupmonth);
 // byweek = await transacs.map(groupweek);
 // byyear = await transacs.map(groupyear);

 useEffect( () => {

  async function rendervals(id,token){

/*
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
          
          let tcs = transacsByOpsBis;
          var campostData =   [];
          var orangeData =  [];
          var mtnData =   [];
          var expressData =   [];
          var dataLabels = [];

          for(var i = 0; i<7; i++)
          {
            campostData.push(tcs[0][i].value);
            orangeData.push(tcs[1][i].value);
            mtnData.push(tcs[2][i].value);
            expressData.push(tcs[3][i].value);
            dataLabels.push(tcs[2][i].datetime);

          }

          let toplot = [
           {
            name : 'CAMPOST',
            type : 'column',
            data : campostData
           },
           {
            name : 'MTN',
            type : 'column',
            data : mtnData
           },
           {
            name : 'ORANGE',
            type : 'column',
            data : orangeData
           },
           {
            name : 'EXPRESS UNION',
            type : 'column',
            data : expressData
           }
          ];
    setChartData(toplot);

  const chartOptionsBis =/* merge(BaseOptionChart(), {
  /*  stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: dataLabels,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} KFCFA`;
          }
          return y;
        }
      }
    }
  });

  setChartOptions(chartOptionsBis);

         
        });

   
  });
}*/
}
  rendervals(params.id, params.token);

 },[chartData,chartOptions]);


  return (
    <Card>
      <CardHeader title="PAIEMENTS DES DERNIERS MOIS" subheader="Cliquez sur les options pour changer d'intervalle" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
