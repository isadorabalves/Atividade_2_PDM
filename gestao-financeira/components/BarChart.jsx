import { useState } from "react";
import { View } from "react-native";
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg";
import { colors } from "../constants/colors";

function fmtY(v) {
  if (v === 0) return "0";
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1000) return sign + (abs % 1000 === 0 ? abs / 1000 : (abs / 1000).toFixed(1)) + "k";
  return sign + String(abs);
}

export default function BarChart({ transactions = [], month, year }) {
  const [chartWidth, setChartWidth] = useState(300);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayTxs = transactions.filter(t => new Date(t.date).getDate() === day);
    const income = dayTxs
      .filter(t => t.category.isIncome)
      .reduce((s, t) => s + Number(t.value), 0);
    const expense = dayTxs
      .filter(t => !t.category.isIncome)
      .reduce((s, t) => s + Number(t.value), 0);
    return { income, expense };
  });

  const rawMax = Math.max(...dailyData.flatMap(d => [d.income, d.expense]), 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;

  const chartH = 140;
  const padLeft = 34;
  const padRight = 4;
  const padTop = 8;
  const padBot = 22;
  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartH - padTop - padBot;
  const zeroY = padTop + innerH / 2;
  const step = innerW / daysInMonth;
  const barW = Math.max(step - 2, 2);
  const scale = (innerH / 2) / niceMax;

  const labelDays = [1, 7, 14, 21, 28].filter(d => d <= daysInMonth);
  const yFracs = [1, 0.5, 0, -0.5, -1];

  return (
    <View onLayout={e => setChartWidth(e.nativeEvent.layout.width)}>
      <Svg width={chartWidth} height={chartH}>
        {/* Gridlines */}
        {yFracs.map(frac => {
          const y = zeroY - frac * niceMax * scale;
          return (
            <Line key={`gl${frac}`}
              x1={padLeft} y1={y}
              x2={chartWidth - padRight} y2={y}
              stroke={frac === 0 ? "#2A3E58" : "#1A2A42"}
              strokeWidth={frac === 0 ? 1.5 : 1}
            />
          );
        })}

        {/* Y-axis labels */}
        {yFracs.map(frac => {
          const y = zeroY - frac * niceMax * scale;
          return (
            <SvgText key={`yl${frac}`}
              x={padLeft - 4} y={y + 4}
              fontSize={9} fill={colors.secondaryText}
              textAnchor="end"
            >
              {fmtY(frac * niceMax)}
            </SvgText>
          );
        })}

        {/* Income bars */}
        {dailyData.map((d, i) => {
          if (d.income === 0) return null;
          const x = padLeft + i * step + (step - barW) / 2;
          const h = Math.max(d.income * scale, 2);
          return (
            <Rect key={`i${i}`}
              x={x} y={zeroY - h}
              width={barW} height={h}
              fill={colors.primary} rx={2}
            />
          );
        })}

        {/* Expense bars */}
        {dailyData.map((d, i) => {
          if (d.expense === 0) return null;
          const x = padLeft + i * step + (step - barW) / 2;
          const h = Math.max(d.expense * scale, 2);
          return (
            <Rect key={`e${i}`}
              x={x} y={zeroY}
              width={barW} height={h}
              fill="#0F4C81" rx={2}
            />
          );
        })}

        {/* Day labels */}
        {labelDays.map(day => {
          const x = padLeft + (day - 1) * step + step / 2;
          return (
            <SvgText key={day}
              x={x} y={chartH - 5}
              fontSize={9} fill={colors.secondaryText}
              textAnchor="middle"
            >
              {String(day).padStart(2, "0")}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
