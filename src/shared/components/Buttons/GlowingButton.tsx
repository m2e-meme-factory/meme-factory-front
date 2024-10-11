import { Button } from '@radix-ui/themes';
import styled from 'styled-components';


export const AccentButton = styled(Button)`
  background: linear-gradient(180deg, #ffd547 0%, var(--brand-color) 100%);
`

const GlowingButton = styled(AccentButton)`
  box-shadow: 0px 0px 20px 0px var(--brand-color);
  animation: glow 3s ease-in-out infinite alternate;

  @keyframes glow {
    0% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }

    50% {
      box-shadow: 0px 0px 20px -20px var(--brand-color);
    }

    100% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }
  }

  &:hover {
    box-shadow: 0px 0px 20px 0px var(--brand-color);
  }
`;

export default GlowingButton;
