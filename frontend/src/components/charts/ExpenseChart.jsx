import React from "react";
import ReactECharts from "echarts-for-react";

const formatCategory = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function ExpenseChart({ data }) {
  const option = {
    tooltip: {
      show: false
    },

    series: [
      {
        name: 'Expenses',
        type: 'pie',
        roseType: 'radius',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            formatter: (params) => {
              const name = params.name;
              const value = params.value.toFixed(2);
              const percent = params.percent;
              return `{a|${name}}\n{b|$${value}}\n{c|${percent}% of total}`;
            },
            rich: {
              a: { color: '#1e293b', fontSize: 22, fontWeight: 'bold', lineHeight: 30 },
              b: { color: '#1e293b', fontSize: 28, fontWeight: 'bold', lineHeight: 40, fontFamily: "'Consolas', 'Menlo', 'Courier New', monospace" },
              c: { color: '#64748b', fontSize: 16, lineHeight: 24 }
            }
          }
        },
        labelLine: {
          show: false
        },
        color: [
          '#4f46e5', // Indigo
          '#0ea5e9', // Sky
          '#10b981', // Emerald
          '#eab308', // Amber
          '#f97316', // Orange
          '#ef4444', // Red
          '#8b5cf6', // Violet
          '#ec4899', // Pink
        ],
        data: data.map(item => ({
          name: formatCategory(item.category),
          value: item.totalAmount
        }))
      }
    ],

    media: [
      {
        query: {
          minWidth: 769
        },
        option: {
          legend: {
            orient: 'vertical',
            left: 'right',
            top: 'center',
            textStyle: {
              color: 'var(--color-text-secondary)'
            }
          },
          series: [
            {
              radius: ['50%', '90%']
            }
          ]
        }
      },
      {
        query: {
          maxWidth: 768
        },
        option: {
          legend: {
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            textStyle: {
              color: 'var(--color-text-secondary)'
            }
          },
          series: [
            {
              radius: ['40%', '70%']
            }
          ]
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
}

export default ExpenseChart;