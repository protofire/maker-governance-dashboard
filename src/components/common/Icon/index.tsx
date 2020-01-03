import React from 'react'
import { ReactComponent as CloseIcon } from './close.svg'
import { ReactComponent as ExpandIcon } from './expand.svg'
import { ReactComponent as NextIcon } from './next.svg'
import { ReactComponent as PreviousIcon } from './previous.svg'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import { ReactComponent as HatIcon } from './hat.svg'
import { ReactComponent as ExternalIcon } from './external.svg'
import { ReactComponent as CopyIcon } from './copy.svg'
import { ReactComponent as InfoIcon } from './info.svg'

const FilterIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10.9" height="10" viewBox="0 0 10.9 10">
    {/*
 // @ts-ignore */}
    <path
      fill={props.selected ? '#00ba9c' : '#999999'}
      id="Filter"
      d="M8.549 4.725a.587.587 0 0 1 .179.418V9.69a.345.345 0 0 0 .578.22l1.4-1.454c.187-.2.29-.3.29-.506V5.144a.592.592 0 0 1 .179-.418l4-3.95A.46.46 0 0 0 14.8 0H4.92a.46.46 0 0 0-.375.777z"
      transform="translate(-4.409)"
    />
  </svg>
)

const CustomSvg = (props: any) => (
  <>
    {/*
 // @ts-ignore */}
    <svg
      className="recharts-surface"
      width="14"
      height="14"
      viewBox="0 0 32 32"
      version="1.1"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}
    >
      {/*
 // @ts-ignore */}
      <path stroke="none" fill={props.color} d="M0,4h32v24h-32z" className="recharts-legend-icon"></path>
    </svg>
  </>
)

export {
  CloseIcon,
  ExpandIcon,
  NextIcon,
  PreviousIcon,
  ArrowIcon,
  FilterIcon,
  HatIcon,
  CustomSvg,
  ExternalIcon,
  CopyIcon,
  InfoIcon,
}
