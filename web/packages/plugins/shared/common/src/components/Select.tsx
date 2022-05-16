import styled from 'styled-components'
import { INPUT_FIELD_WIDTH } from '../utils/variables'

export const Select = styled.select`
  position: relative;
  font-size: medium;
  padding: 6px 8px;
  border: 0;
  border-bottom: 2px solid #dbdbdb;
  cursor: pointer;
  height: 34px;
  background-color: #f7f7f7;
  width: ${INPUT_FIELD_WIDTH};
`
