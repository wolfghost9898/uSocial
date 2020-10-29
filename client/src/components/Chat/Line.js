import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from "moment";


const LineGraph = ({ confirmados,recuperados, muertos }) => {
  const data = {
    labels: [
        moment()
        .subtract(1,"month")
        .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
    ],
    datasets: [
      {
        label: 'Confirmados',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#EC6B56',
        borderColor: '#EC6B56',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#EC6B56',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#EC6B56',
        pointHoverBorderColor: '#EC6B56',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      },
      {
        label: 'Recuperados',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#FFC154',
        borderColor: '#FFC154',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#FFC154',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FFC154',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      },
      
      {
        label: 'Muertes',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#47B39C',
        borderColor: '#47B39C',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#47B39C',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#47B39C',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      }

    ]
  };
  data.datasets[0].data = []
  data.datasets[0].data = confirmados

  data.datasets[1].data = []
  data.datasets[1].data = recuperados

  data.datasets[2].data = []
  data.datasets[2].data = muertos


  const lineOptions = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "lll"
          },
          gridLines: {
            display: true
          },
          ticks: {
            maxTicksLimit: 31
          }
        }
      ],
      yAxes: [
        {
          // stacked: true,
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ]
    },
    legend: {
      display: true
    },
    tooltips: {
      enabled: true
    }
  };

  return (
    <div>
      <Line redraw data={data}  options={lineOptions}/>
    </div>
  );
}

export default LineGraph