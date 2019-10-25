import React, { useState } from 'react'
import styled, { css } from 'styled-components'

// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

const FilterWrapper = styled.div`
  position: absolute;
  @media (min-width: 480px) {
    min-width: ${props => (props.selector ? 'auto' : '300px')};
  }
  min-height: ${props => (props.selector ? 'auto' : '115px')};
  border-radius: 3px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px #f3f3f3;
  background-color: #ffffff;
  &:before {
    content: '';
    position: absolute;
    top: -12px;
    left: ${props => (props.selector ? '55%' : '12%')};
    transform: rotate(90deg);
    z-index: 1;
    border: solid 6px transparent;
    border-right-color: white;
  }
`
const InputContainer = styled.div`
  padding: 15px;
  flex-direction: column !important;
  input {
    border-radius: 2px;
    box-sizing: border-box;
    padding-left: 12px;
    border: solid 1px #d9d9d9;
    height: 38px;
    width: 100%;
  }
`
const ButtonsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  div {
    display: flex;
    flex: 1;
    height: 30px;
    border-radius: 3px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  div:first-child {
    background-color: rgba(83, 105, 121, 0.8);
    margin-right: 10px;
  }
  div:nth-child(2) {
    background-color: #00ba9c;
  }
`
const List = styled.ul`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 0;
  margin: 0;
  list-style-type: none;
`
const ListItem = styled.li`
  cursor: pointer;
  padding: 15px;
  color: #444444;
  &:hover {
    background: #00ba9c;
    color: #fff;
  }
  ${props =>
    props.selected &&
    css`
      background: #00ba9c;
      color: #fff;
    `}
`

// Define a default UI for filtering
export const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  const [value, setValue] = useState(filterValue || '')

  return (
    <FilterWrapper>
      <InputContainer>
        <input
          defaultValue={value}
          onChange={e => setValue(e.target.value || undefined)}
          placeholder={` Search by name...`}
        />
        <ButtonsContainer>
          <div onClick={() => setFilter(undefined)}>
            <span>Clear</span>
          </div>
          <div onClick={() => setFilter(value)}>
            <span>Search</span>
          </div>
        </ButtonsContainer>
      </InputContainer>
    </FilterWrapper>
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
    <FilterWrapper selector>
      <List>
        <ListItem selected={!filterValue} onClick={() => setFilter(undefined)}>
          All
        </ListItem>
        {options.map((option: any) => (
          <ListItem selected={filterValue === option} key={option} onClick={() => setFilter(option)} value={option}>
            {option}
          </ListItem>
        ))}
      </List>
    </FilterWrapper>
  )
}

export const fuzzyTextFilterFn = (rows, id, filterValue) =>
  matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
