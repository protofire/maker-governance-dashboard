import React from 'react'

const SpinnerSVG = props => {
  const { width, height, color, ...restProps } = props

  return (
    <svg width={parseInt(width)} height={parseInt(height)} viewBox="0 0 46 46" {...restProps}>
      <path
        d="M31.819 5l2.362 1.364-3.128 5.416-2.362-1.364zM41 14.181l-1.361-2.362-5.419 3.128 1.364 2.362zm-4.256 10.183H43v-2.728h-6.256zm-2.524 6.689l5.419 3.128L41 31.819l-5.419-3.128zm-5.529 4.531L31.819 41l2.362-1.364-3.128-5.416zM21.636 43h2.727v-6.256h-2.727zm-9.817-3.361L14.181 41l3.128-5.419-2.362-1.361zM5 31.819l1.364 2.362 5.416-3.128-1.364-2.362zm-2-7.455h6.256v-2.728H3zm8.78-9.416l-5.419-3.129L5 14.181l5.418 3.128zm.039-8.586l3.128 5.418 2.362-1.364L14.181 5zm9.817 2.895h2.727V3h-2.727z"
        fill={color}
      />
    </svg>
  )
}

export default SpinnerSVG
