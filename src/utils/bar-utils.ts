export const chartColors = {
  blue: 'rgba(0, 82, 255, 0.3)',
  orange: 'rgba(143, 43, 143, 0.3)',
  green: 'rgba(33, 150, 83, 0.3)',
  blueSolid: '#0052FF',
  orangeSolid: '#8F2B8F',
  greenSolid: '#219653',
  textColor: '#292929'
};

export function barOptions(
  animationsEnabled = true,
  annotation: XAxisAnnotations['x'][] = [],
  categories: ApexXAxis['categories'] = [],
  colors: ApexFill['colors'] = [],
  max: ApexYAxis['max'],
  showXLabels = true,
  strokes: ApexStroke['colors'] = [],
  title = '',
  tooltipEnabled = false,
  tooltips = '' as any,
  types: ApexFill['type'] = [],
  xaxis: ApexTitleSubtitle['text'] = '',
  yaxis: ApexTitleSubtitle['text'] = ''
) {
  return {
    chart: {
      id: 'basic-bar',
      fontFamily: 'IBMPlexSans, system',
      toolbar: {
        show: false
      },
      animations: {
        enabled: animationsEnabled
      },
      events: {
        mounted: function () {
          document.querySelectorAll<HTMLElement>('.innovationtest .apexcharts-xaxis-annotations line').forEach(line => {
            line.style.strokeDasharray = '2';
          });
        }
      }
    },
    plotOptions: {
      bar: {
        barHeight: '70%',
        dataLabels: {},
        distributed: true
      }
    },
    fill: {
      opacity: 1,
      type: types,
      pattern: {
        style: 'slantedLines',
        height: 8,
        strokeWidth: 1
      },
      colors: colors
    },
    stroke: {
      width: 1,
      colors: strokes
    },
    legend: {
      show: false
    },
    dataLabels: {
      style: {
        colors: [chartColors.textColor],
        fontWeight: 'normal'
      }
    },
    yaxis: {
      min: 0,
      max: max,
      tickAmount: 6,
      forceNiceScale: true,
      decimalsInFloat: 0,
      axisBorder: {
        show: true,
        color: '#D0CFCF',
        offsetY: -2
      },
      title: {
        text: yaxis,
        style: {
          fontWeight: 400
        }
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#D0CFCF',
        width: 6,
        offsetX: 0,
        offsetY: 0
      },
      labels: {
        style: {
          colors: ['#5F5F5F']
        },
        formatter: function (value: any) {
          if (max || max !== 100) {
            return value.toLocaleString('da-DK');
          }

          return !tooltipEnabled ? value + '%' : value;
        }
      }
    },
    grid: {
      show: false
    },
    title: {
      text: title
    },
    annotations: {
      position: 'back',
      xaxis: [
        {
          x: annotation && annotation[0] ? annotation[0] : '',
          borderColor: chartColors.blueSolid,
          strokeDashArray: 2,
          label: {
            text: 'Din vurdering',
            offsetY: 16,
            orientation: 'horizontal',
            borderColor: 'transparent',
            style: {
              background: '#f5f5f5',
              padding: {
                top: 24,
                right: 12
              }
            }
          }
        },
        {
          x: annotation && annotation[1] ? annotation[1] : '',
          borderColor: chartColors.orangeSolid,
          label: {
            text: annotation && annotation[1] === annotation[0] ? 'Dit resultat &' : 'Dit resultat',
            orientation: 'horizontal',
            borderColor: 'transparent',
            style: {
              background: '#f5f5f5',
              padding: {
                top: 24,
                right: 12
              }
            }
          }
        }
      ]
    },
    xaxis: {
      labels: {
        show: showXLabels
      },
      axisBorder: {
        show: true,
        color: '#D0CFCF',
        offsetY: -1
      },
      title: {
        text: xaxis,
        style: {
          fontWeight: 400
        }
      },
      categories: categories,
      axisTicks: {
        show: false
      }
    },
    tooltip: {
      enabled: tooltipEnabled,
      followCursor: false,
      y: {
        title: {
          formatter: (value: string) => {
            if (title) {
              return title;
            }

            return value;
          }
        }
      },
      x: {
        formatter: (value: number, { dataPointIndex }: ApexDiscretePoint) => {
          if (tooltips && dataPointIndex) {
            if (value === tooltips[dataPointIndex]) {
              return tooltips[dataPointIndex];
            }

            return tooltips && value + ': ' + tooltips[dataPointIndex];
          }

          return value;
        }
      }
    }
  };
}
