import { Button } from '@radix-ui/themes';
import styled from 'styled-components';

const YellowBorderButton = styled(Button)`
  width: 100%;
  background: transparent;
  border: 1px solid #ffcf0b;
  border-radius: 8px;
  padding: 6px 20px 5px;
  font-weight: 700;
  font-size: 13px;
  color: #ffcf0b;
  line-height: 154%;
  text-transform: uppercase;
  text-align: center;

  &:hover {
    box-shadow: 0px 0px 0px 0px var(--brand-color);
  }
  &:disabled {
    color: #ffcf0b;
    animation: none;
    box-shadow: none;
    opacity: 0.5;
  }

  &:where('data-disabled') {
    color: #ffcf0b;
    animation: none;
    box-shadow: none;
    opacity: 0.5;
  }
`;

export default YellowBorderButton;
