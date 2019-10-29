import React, { useState } from 'react'
import styled, { css } from 'styled-components'

// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

const FilterWrapper = styled.div`
  background-color: #fff;
  border-radius: 3px;
  border: solid 1px #f3f3f3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  position: absolute;
  z-index: 1;

  @media (min-width: 480px) {
    min-width: ${props => (props.selector ? 'auto' : '300px')};
  }

  &:before {
    border-right-color: white;
    border: solid 6px transparent;
    content: '';
    left: ${props => (props.selector ? '55%' : '12%')};
    position: absolute;
    top: -12px;
    transform: rotate(90deg);
    z-index: 1;
  }
`
const InputContainer = styled(FilterWrapper)`
  display: flex;
  flex-direction: column !important;
  min-height: 115px;
  padding: 15px;
`

const SearchField = styled.input`
  border-radius: 2px;
  border: solid 1px ${props => props.theme.borders.borderColor};
  box-sizing: border-box;
  color: ${props => props.theme.colors.textCommon};
  font-size: 13px;
  font-weight: normal;
  height: 38px;
  outline: none;
  padding: 0 12px;
  width: 100%;

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`

const ButtonsContainer = styled.div`
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

const ButtonSearch = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
`

const List = styled(FilterWrapper)`
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 200px;

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
