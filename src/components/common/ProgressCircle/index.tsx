import React, { HTMLAttributes } from 'react'
import styled, { withTheme } from 'styled-components'

const ProgressCircleStyled = styled.div<CircleProps>`
  align-items: center;
  background-color: #eaeaea;
  border-radius: 50%;
  display: flex;
  height: ${props => props.height}px;
  justify-content: center;
  position: relative;
  width: ${props => props.width}px;
`

const InnerCircle = styled.div<CircleProps>`
  align-items: center;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  height: ${props => props.height}px;
  justify-content: center;
  position: relative;
  width: ${props => props.width}px;
  z-index: 5;
`

const ProgressBar = styled.svg<CircleProps>`
  height: ${props => props.height}px;
  left: 0;
  position: absolute;
  top: 0;
  width: ${props => props.width}px;
  z-index: 1;
`

const ProgressBarColor = styled.circle`
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
  transition: 0.25s stroke-dashoffset;
`

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  borderWidth?: string
  color?: string
  dimensions?: string
  progress: string
  theme: any
  children: any
}

interface CircleProps {
  height: string
  width: string
}

const ProgressCircleWrapper: React.FC<ProgressCircleProps> = (props: ProgressCircleProps) => {
  const { borderWidth = '16', color, dimensions = '116', progress, theme, children, ...restProps } = props

  const currentProgress: string = (+progress < 0 ? 0 : +progress > 100 ? 100 : progress).toString()
  const innerCircleDimensions: string = (+dimensions - +borderWidth).toString()
  const svgCXY: string = (+dimensions / 2).toString()
  const svgCircleRadius: string = (+innerCircleDimensions / 2).toString()
  const circumference: string = (+svgCircleRadius * 2 * Math.PI).toString()
  const offset: string = (+circumference - (+currentProgress / 100) * +circumference).toString()
  const progressColor: string = color ? color : theme.colors.primary

  return (
    <ProgressCircleStyled width={dimensions} height={dimensions} {...restProps}>
      <InnerCircle width={innerCircleDimensions} height={innerCircleDimensions}>
        {children}
      </InnerCircle>
      <ProgressBar width={dimensions} height={dimensions}>
        <ProgressBarColor
          cx={svgCXY}
          cy={svgCXY}
          fill="transparent"
          r={svgCircleRadius}
          stroke={progressColor}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeWidth={borderWidth}
        />
      </ProgressBar>
    </ProgressCircleStyled>
  )
}

export default withTheme(ProgressCircleWrapper)
