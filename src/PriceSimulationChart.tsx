import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useTheme } from "@material-ui/styles";
import { linspace } from "./utils";

function PriceSimulationChart({
  priceTimeseries,
  withdrawFeeTimeseries,
  p0,
  p1
}: {
  priceTimeseries: number[];
  withdrawFeeTimeseries: number[];
  p0: number;
  p1: number;
}) {
  // d0      - Initial raise, d0 (DAI)
  // theta   - fraction allocated to reserve (.)
  // p0      - Hatch sale Price p0 (DAI / token)
  // returnF - Return factor (.)
  // wFee    - friction coefficient (.)

  const keyHorizontal = "x";
  const keyVerticalLeft = "Price (DAI / token)";
  const keyVerticalRight = "Total exit tributes (DAI)";

  const data = [];
  for (let t = 0; t < priceTimeseries.length; t++) {
    data.push({
      [keyHorizontal]: t,
      [keyVerticalLeft]: priceTimeseries[t] || 0,
      [keyVerticalRight]: withdrawFeeTimeseries[t] || 0
    });
  }

  // Chart components

  const theme: any = useTheme();

  function renderColorfulLegendText(value: string) {
    return <span style={{ color: theme.palette.text.secondary }}>{value}</span>;
  }

  const formatter = (n: number) => (+n.toPrecision(3)).toLocaleString();

  function ReferenceLabel(props: any) {
    const { textAnchor, viewBox, text } = props;
    return (
      <text
        x={viewBox.x + 10}
        y={viewBox.y - 10}
        fill={theme.palette.text.secondary}
        textAnchor={textAnchor}
      >
        {text}
      </text>
    );
  }

  return (
    <ResponsiveContainer debounce={1}>
      <AreaChart
        width={0}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={keyHorizontal}
          tick={{ fill: theme.palette.text.secondary }}
          stroke={theme.palette.text.secondary}
          ticks={[
            ...linspace({
              to: priceTimeseries.length,
              steps: 4
            }).map(Math.floor),
            priceTimeseries.length - 1
          ]}
        />

        {/* Price time evolution */}
        <YAxis
          yAxisId="left"
          domain={[0, Math.max(...priceTimeseries, p1 * 1.25)]}
          tickFormatter={formatter}
          tick={{ fill: theme.palette.text.secondary }}
          stroke={theme.palette.text.secondary}
        />

        {/* Capital collected from withdraw fees - AXIS */}
        <YAxis
          yAxisId="right"
          // domain={[
          //   Math.floor(Math.min(...withdrawFeeTimeseries)),
          //   Math.ceil(Math.max(...withdrawFeeTimeseries))
          // ]}
          orientation="right"
          tick={{ fill: theme.palette.text.secondary }}
          stroke={theme.palette.text.secondary}
        />

        <Tooltip formatter={value => Number(value)} />

        <Area
          isAnimationActive={false}
          yAxisId="left"
          type="monotone"
          dataKey={keyVerticalLeft}
          stroke={theme.palette.primary.main}
          fill={theme.palette.primary.main}
        />
        <ReferenceLine
          y={p0}
          yAxisId="left"
          stroke={theme.palette.primary.main}
          strokeDasharray="9 0"
          label={<ReferenceLabel text="Hatch sale price" />}
        />
        <ReferenceLine
          y={p1}
          yAxisId="left"
          stroke={theme.palette.primary.main}
          strokeDasharray="9 0"
          label={<ReferenceLabel text="After hatch price" />}
        />

        {/* Capital collected from withdraw fees - AREA */}
        <Area
          isAnimationActive={false}
          yAxisId="right"
          type="monotone"
          dataKey={keyVerticalRight}
          stroke={theme.palette.secondary.main}
          fill={theme.palette.secondary.main}
        />

        {/* <ReferenceLine
          x={R0}
          stroke="#90a4ae"
          strokeDasharray="6 3"
          label={<ReferenceLabel />}
        /> */}
        <Legend formatter={renderColorfulLegendText} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default PriceSimulationChart;
