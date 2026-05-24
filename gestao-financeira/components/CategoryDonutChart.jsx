import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SIZE = 200;
const STROKE = 28;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CategoryDonutChart({ segments = [] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let accumulated = 0;
  const slices = segments.map(seg => {
    const dash = total > 0 ? CIRCUMFERENCE * (seg.value / total) : 0;
    const offset = -accumulated;
    accumulated += dash + 3;
    return { color: seg.color, dash, offset };
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke="#10213A" strokeWidth={STROKE} fill="transparent"
        />
        {slices.map((s, i) => (
          <Circle
            key={i}
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            stroke={s.color}
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={`${s.dash} ${CIRCUMFERENCE}`}
            strokeDashoffset={s.offset}
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: SIZE,
    height: SIZE,
  },
});
