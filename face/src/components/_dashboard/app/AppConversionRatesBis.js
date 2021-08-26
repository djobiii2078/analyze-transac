import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [{ data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380] }];

function getDataPerOp(transac,regions)
{
  transac.map(function(element){
    sum = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
    sum[regions.indexOf(element.operator)]+=parseFloat(element.value);
    return sum;
  });
}


export default function AppConversionRatesBis(transacs) {


  const regionsLabels = ['EXTREMENORD','NORD','ADAMAOUA','EST','CENTRE','SUD','LITTORAL','OUEST','NORDOUEST','SUDOUEST'];

  const [toplot, setToplot] = useState(CHART_DATA);

  useEffect(() => {
    async function rendervals(inputs){
        let tcs = await inputs; 
        let campostData = await getDataPerOp(tcs[0],regionsLabels);
        let mtnData = await getDataPerOp(tcs[1],regionsLabels);
        let orangeData = await getDataPerOp(tcs[2],regionsLabels);
        let expressData = await getDataPerOp(tcs[3],regionsLabels);

  toplot = [
           {
            name : 'CAMPOST',
            type : 'column',
            data : campostData.values;
           },
           {
            name : 'MTN',
            type : 'column',
            data : mtnData.values;
           },
           {
            name : 'ORANGE',
            type : 'column',
            data : orangeData.values;
           },
           {
            name : 'EXPRESS UNION',
            type : 'column',
            data : expressData.values;
           }
          ];

          setToplot(toplot);

    }
    rendervals(transacs);
  },[]);

 
  const chartOptions = /*merge(BaseOptionChart(),*/ {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: regionsLabels;
    }
  }/*);*/

  return (
    <Card>
      <CardHeader title="MONTANT PAR REGION" subheader="(+23%) COMPARE A L'ANNE PASSE" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={toplot} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
