import React from 'react'
import { DimensionValue, StyleSheet, Text, View } from 'react-native'
import { CartesianChart, Line, useChartPressState } from "victory-native"
import { DerivedValue, SharedValue, useDerivedValue } from 'react-native-reanimated'
import { useFont, Circle, Text as SkiaText } from '@shopify/react-native-skia'
//styles
import { Spacing } from '@styles/index'
import { windowHeight, windowWidth } from '@utils/constants'

type Props = {
  data: { createdAt: string, value: number }[]
  width?: DimensionValue
  height?: DimensionValue
  lineColor: string
  strokeWidth?: number
}

const ToolTip = ({ x, y, color, value, font, lineColor }: { x: SharedValue<number>; y: SharedValue<number>, color: string, value: DerivedValue<string>, font: any, lineColor: string }) => {
  const xText = useDerivedValue(() => x.value - 10, [x])
  const yText = useDerivedValue(() => y.value - 20, [y])

  return (
    <>
      <SkiaText x={xText} y={yText} font={font} color={lineColor} text={value} />
      <Circle cx={x} cy={y} r={8} color={color} />
    </>
  )
}

const LineChart = ({  data, width = windowWidth*0.7, height = windowHeight*0.3, lineColor, strokeWidth = 2 }: Props) => {
  const chartData = data.map(p => ({
    value: p.value,
    createdAt: new Date(p.createdAt).getTime()
  }))
  
  const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } })
  const value = useDerivedValue(() => state.y.value.value.value.toFixed(0), [state])

  const roboto = require('@assets/fonts/Roboto-Regular.ttf')
  const font = useFont(roboto, 12)

  return (
    <View style={{ width: width, height: height, margin: 20 }}>
      <CartesianChart
        data={chartData}
        xKey="createdAt"
        xAxis={{
          formatXLabel: (createdAt) => new Date(createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit'}),
          font: font,
        }}
        yKeys={["value"]}
        yAxis={[{ font: font }]}
        chartPressState={state}
        domain={{ y: [0] }}
        domainPadding={{ top: 30, left: 10, right: 10, bottom: 10 }}
      >
        {({ points }) => (
          <>
            <Line points={points.value} color={lineColor} strokeWidth={strokeWidth} />
            {isActive &&
              <>
                <ToolTip x={state.x.position} y={state.y.value.position} color={lineColor} font={font} value={value} />
              </>
            }
          </>
        )}
      </CartesianChart>
    </View>
  )
}

export default LineChart

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRowStretch,
  },
})