import * as React from 'react';
import { createComponent } from '@mui/toolpad-core';
import { Container, ContainerProps } from '@mui/material';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Bar,
  Area,
  Scatter,
} from 'recharts';
import { SX_PROP_HELPER_TEXT } from './constants';

export const CHART_DATA_SERIES_KINDS = ['line', 'bar', 'area', 'scatter'];

export interface ChartDataSeries<D = Record<string, string | number>> {
  kind: (typeof CHART_DATA_SERIES_KINDS)[number];
  label: string;
  data?: D[];
  xKey: keyof D;
  yKey: keyof D;
  color?: string;
}

export type ChartData = ChartDataSeries[];

function getBarChartDataSeriesNormalizedYKey(dataSeries: ChartDataSeries, index: number): string {
  return `${dataSeries.label}-${dataSeries.yKey}-${index}`;
}

interface ChartProps extends ContainerProps {
  data?: ChartData;
  height?: number;
}

function Chart({ data = [], height, sx }: ChartProps) {
  const xValues = React.useMemo(() => {
    const allXValues = data.flatMap((dataSeries) =>
      (dataSeries.data || []).map((dataSeriesPoint) => dataSeriesPoint[dataSeries.xKey]),
    );

    return allXValues
      .filter((value, index) => allXValues.indexOf(value) === index)
      .sort((a: number | string, b: number | string) =>
        typeof a === 'number' && typeof b === 'number' ? a - b : 0,
      );
  }, [data]);

  const barChartData = React.useMemo(() => {
    return xValues.map((xValue) => {
      const yValues = data.reduce((acc, dataSeries, index) => {
        if (dataSeries.kind !== 'bar') {
          return acc;
        }

        const point = (dataSeries.data || []).find(
          (dataSeriesPoint) => dataSeriesPoint[dataSeries.xKey] === xValue,
        );

        return {
          ...acc,
          [getBarChartDataSeriesNormalizedYKey(dataSeries, index)]: point
            ? point[dataSeries.yKey]
            : 0,
        };
      }, {});

      return {
        x: xValue,
        ...yValues,
      };
    });
  }, [data, xValues]);

  const hasNonNumberXValues = xValues.some((xValue) => typeof xValue !== 'number');

  return (
    <Container disableGutters sx={sx}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={barChartData} margin={{ top: 20, right: 60 }}>
          <CartesianGrid />
          <XAxis
            dataKey="x"
            type={hasNonNumberXValues ? 'category' : 'number'}
            allowDuplicatedCategory={false}
            domain={
              hasNonNumberXValues
                ? undefined
                : [Math.min(...(xValues as number[])), Math.max(...(xValues as number[]))]
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((dataSeries, index) => {
            if (!dataSeries.data || dataSeries.data.length === 0) {
              return null;
            }

            const key = `${dataSeries.label}-${index}`;

            const normalizedData = dataSeries.data.map((dataSeriesPoint) => ({
              x: dataSeriesPoint[dataSeries.xKey],
              [dataSeries.yKey]: dataSeriesPoint[dataSeries.yKey],
            }));

            switch (dataSeries.kind) {
              case 'bar':
                return (
                  <Bar
                    key={key}
                    dataKey={getBarChartDataSeriesNormalizedYKey(dataSeries, index)}
                    name={dataSeries.label}
                    barSize={20}
                    fill={dataSeries.color}
                  />
                );
              case 'area':
                return (
                  <Area
                    key={key}
                    type="monotone"
                    data={normalizedData}
                    dataKey={dataSeries.yKey}
                    name={dataSeries.label}
                    stroke={dataSeries.color}
                    fill={dataSeries.color}
                  />
                );
              case 'scatter':
                return (
                  <Scatter
                    key={key}
                    data={normalizedData}
                    dataKey={dataSeries.yKey}
                    name={dataSeries.label}
                    fill={dataSeries.color}
                  />
                );
              default:
                return (
                  <Line
                    key={key}
                    type="monotone"
                    data={normalizedData}
                    dataKey={dataSeries.yKey}
                    name={dataSeries.label}
                    stroke={dataSeries.color}
                  />
                );
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default createComponent(Chart, {
  resizableHeightProp: 'height',
  argTypes: {
    data: {
      helperText: 'The data to be displayed.',
      type: 'array',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            kind: {
              type: 'string',
              enum: CHART_DATA_SERIES_KINDS,
              default: 'line',
            },
            label: {
              type: 'string',
            },
            data: {
              type: 'object',
              default: [],
            },
            xKey: {
              type: 'string',
              default: 'x',
            },
            yKey: {
              type: 'string',
              default: 'y',
            },
            color: {
              type: 'string',
            },
          },
        },
      },
      control: { type: 'ChartData', bindable: false },
    },
    height: {
      type: 'number',
      default: 400,
      minimum: 100,
    },
    sx: {
      helperText: SX_PROP_HELPER_TEXT,
      type: 'object',
    },
  },
});
