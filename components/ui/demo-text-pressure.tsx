import TextPressure from './TextPressure';

export default function TextPressureDemo() {
  return (
    <div style={{ position: 'relative', height: '300px' }}>
      <TextPressure
        text="text!"
        flex={true}
        alpha={false}
        stroke={false}
        width={false}
        weight={true}
        italic={false}
        radius={1.1}
        smoothing={0.3}
        idle="none"
        idleSpeed={1}
        clickRipple={true}
        strokeColor="#ffffff"
        strokeWidth={3}
        minFontSize={36}
        scale
      />
    </div>
  );
}
