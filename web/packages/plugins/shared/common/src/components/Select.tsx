import styled from 'styled-components'
import { INPUT_FIELD_WIDTH } from '../utils/variables'

export const Select = styled.select`
  position: relative;
  font-size: medium;
  padding: 8px 16px;
  border: 0;
  border-bottom: 2px solid #dbdbdb;
  cursor: pointer;
  width: fit-content;
  background-color: #f7f7f7;
  width: ${INPUT_FIELD_WIDTH};
`
