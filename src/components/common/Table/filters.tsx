import React, { useState } from 'react'
import styled, { css } from 'styled-components'

// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

const FilterWrapper = styled.div`
  background-color: #fff;
  border-radius: ${props => props.theme.borders.commonBorderRadius};
  border: solid 1px #f3f3f3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;

  &::before {
    border-bottom: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    content: '';
    height: 0;
    left: calc(12% - 3px);
    position: absolute;
    top: -6px;
    width: 0;
    z-index: 5;
  }

  &::after {
    border-bottom: 7px solid rgba(0, 0, 0, 0.05);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    content: '';
    height: 0;
    left: calc(12% - 5px);
    position: absolute;
    top: -7px;
    width: 0;
    z-index: 1;
  }
`
const InputContainer = styled(FilterWrapper)`
  display: flex;
  flex-direction: column !important;
  min-height: 115px;
  padding: 15px;
  width: 300px;
`

export const SearchField = styled.input`
  border-radius: 2px;
  border: solid 1px ${props => props.theme.borders.borderColor};
  box-sizing: border-box;
  color: ${props => props.theme.colors.textCommon};
  font-size: 13px;
  font-weight: normal;
  height: 38px;
  outline: none;
  padding: 0 12px;

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`

export const ButtonsContainer = styled.div`
  column-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 20px 0 0 0;
`

const Button = styled.div`
  align-items: center;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 15px;
  font-weight: 600;
  height: 30px;
  justify-content: center;
  text-transform: uppercase;
`

const ButtonCancel = styled(Button)`
  background-color: rgba(83, 105, 121, 0.8);
`

export const ButtonSearch = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
`

const List = styled(FilterWrapper)`
  list-style: none;
  margin: 0;
  max-width: 200px;
  min-width: 100px;
  padding: 0;

  &:last-child {
    border-bottom: none;
  }
`

const ListItem = styled.li`
  color: ${props => props.theme.colors.textCommon};
  cursor: pointer;
  height: 38px;
  line-height: 38px;
  padding: 0 15px;
  text-transform: capitalize;

  &:first-child {
    border-top-left-radius: ${props => props.theme.borders.commonBorderRadius};
    border-top-right-radius: ${props => props.theme.borders.commonBorderRadius};
  }

  &:last-child {
    border-bottom-left-radius: ${props => props.theme.borders.commonBorderRadius};
    border-bottom-right-radius: ${props => props.theme.borders.commonBorderRadius};
  }

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #fff;
  }

  ${props =>
    props.selected &&
    css`
      background: ${props => props.theme.colors.primary};
      color: #fff;
    `}
`

// Define a default UI for filtering
export const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  const [value, setValue] = useState(filterValue || '')

  return (
    <InputContainer>
      <SearchField
        defaultValue={value}
        onChange={e => setValue(e.target.value || undefined)}
        placeholder={` Search by name...`}
      />
      <ButtonsContainer>
        <ButtonCancel onClick={() => setFilter(undefined)}>Clear</ButtonCancel>
        <ButtonSearch onClick={() => setFilter(value)}>Search</ButtonSearch>
      </ButtonsContainer>
    </InputContainer>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <List selector as="ul">
      <ListItem selected={!filterValue} onClick={() => setFilter(undefined)}>
        All
      </ListItem>
      {options.map((option: any) => (
        <ListItem selected={filterValue === option} key={option} onClick={() => setFilter(option)} value={option}>
          {option}
        </ListItem>
      ))}
    </List>
  )
}

export const fuzzyTextFilterFn = (rows, id, filterValue) =>
  matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
