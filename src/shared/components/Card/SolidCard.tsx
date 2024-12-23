import { Card } from "@radix-ui/themes";
import styled from "styled-components";

export const SolidCard = styled(Card)`
  &::before {
    backdrop-filter: none;
    background-color: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
`;