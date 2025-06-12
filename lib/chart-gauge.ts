// This is a custom Chart.js plugin for the gauge chart
// It will be imported and used in the results-visualization.tsx component

import { Chart } from "chart.js"

// Define the gauge chart type
Chart.defaults.gauge = Chart.defaults.doughnut

// Extend the doughnut controller
Chart.controllers.gauge = Chart.controllers.doughnut.extend({
  draw: function () {
    Chart.controllers.doughnut.prototype.draw.call(this)

    const chart = this.chart
    const ctx = chart.ctx
    const width = chart.width
    const height = chart.height

    const needleValue = chart.config.data.datasets[0].value
    const dataTotal = chart.config.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
    const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI

    const cx = width / 2
    const cy = height / 2

    // Draw the needle
    const needleLength = (chart.innerRadius * (chart.config.options.needle?.lengthPercentage || 80)) / 100
    const needleWidth = (chart.innerRadius * (chart.config.options.needle?.widthPercentage || 2)) / 100
    const needleRadius = (chart.innerRadius * (chart.config.options.needle?.radiusPercentage || 2)) / 100

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)

    // Draw the needle pointer
    ctx.beginPath()
    ctx.moveTo(0, -needleWidth / 2)
    ctx.lineTo(needleLength, 0)
    ctx.lineTo(0, needleWidth / 2)
    ctx.fillStyle = chart.config.options.needle?.color || "rgba(0, 0, 0, 0.5)"
    ctx.fill()

    // Draw the needle center circle
    ctx.beginPath()
    ctx.arc(0, 0, needleRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    // Draw the value label
    if (chart.config.options.valueLabel?.display) {
      const formatter = chart.config.options.valueLabel.formatter || ((value: number) => `${value}`)
      const padding = chart.config.options.valueLabel.padding || { top: 5, bottom: 5 }

      ctx.save()
      ctx.translate(cx, cy)

      const fontSize = 24
      ctx.font = `${fontSize}px sans-serif`
      ctx.textBaseline = "middle"
      ctx.textAlign = "center"

      const text = formatter(needleValue)
      const textWidth = ctx.measureText(text).width + 20

      // Draw background
      ctx.beginPath()
      ctx.roundRect(
        -textWidth / 2,
        height / 4 - padding.top,
        textWidth,
        fontSize + padding.top + padding.bottom,
        chart.config.options.valueLabel.borderRadius || 0,
      )
      ctx.fillStyle = chart.config.options.valueLabel.backgroundColor || "#fff"
      ctx.fill()

      // Draw text
      ctx.fillStyle = chart.config.options.valueLabel.color || "#000"
      ctx.fillText(text, 0, height / 4 + fontSize / 2)

      ctx.restore()
    }
  },
})
