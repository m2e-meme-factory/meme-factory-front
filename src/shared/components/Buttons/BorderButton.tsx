import { Button } from '@radix-ui/themes';
import styled from 'styled-components';

const BorderButton = styled(Button)`
    margin-top: auto;
    width: 100%;
    background: transparent;
    border: 1px solid #000;
    border-radius: 8px;
    padding: 6px 20px;
    font-weight: 700;
    font-size: 13px;
    line-height: 154%;
    text-transform: uppercase;
    text-align: center;
    height: 32px;
`;

export default BorderButton;