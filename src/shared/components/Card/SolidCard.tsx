import { Card } from "@radix-ui/themes";
import styled from "styled-components";


export const ActionCard = styled.div`
  background-color: #090909;
  padding: var(--space-3);
  border: 1px solid color-mix(in oklab, #efe6fe25, #323035 25%);
  border-radius: var(--radius-4);
`
export const SolidCard = ActionCard;


// export const SolidCard = styled(Card)`
//   &::before {
//     backdrop-filter: none;
//     background-color: none;
//     -webkit-backdrop-filter: none;
//     backdrop-filter: none;
//   }
// `;
