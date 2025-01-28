import styled from 'styled-components';
import { SolidCard } from '@shared/components/Card/SolidCard';

export const NftCard = styled(SolidCard)<{
   glowing: boolean;
   bronzes: boolean;
   silvers: boolean;
   dimonds: boolean;
   investors: boolean;
}>`
   /* min-height: 12vh; */
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   transition: ease 0.2s;
   ${(props) =>
     props.glowing
       ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #908a73 0%, #1c1c1e 100%);'
       : ''};
   ${(props) =>
     props.bronzes
       ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #7b675b 0%, #1c1c1e 100%);'
       : ''};
   ${(props) =>
     props.silvers
       ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #848484 0%, #1c1c1e 100%);'
       : ''};
   ${(props) =>
     props.dimonds
       ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #738e91 0%, #1c1c1e 100%);'
       : ''};
   ${(props) =>
     props.investors
       ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #7a6c84 0%, #1c1c1e 100%);'
       : ''};

   &:active {
      cursor: pointer;
      transform: scale(0.8);
   }

   animation: ${(props) => (props.glowing ? 'glow 3s ease-in-out infinite alternate' : 'none')};

   @keyframes glow {
      0% {
         border: 1px solid var(--brand-color);
      }

      50% {
         border: 1px solid transparent;
      }

      100% {
         border: 1px solid var(--brand-color);
      }
   }
`;