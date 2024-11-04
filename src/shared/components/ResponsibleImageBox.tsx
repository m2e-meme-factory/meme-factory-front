import styled from 'styled-components';

export const ResponsibleImageBox = styled.div`
  height: 200px;

  @media (min-height: 600px) {
    height: 250px;
  }
  @media (min-height: 800px) {
    height: 300px;
  }
  @media (min-width: 641px) {
    /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  }
  @media (min-width: 961px) {
    /* tablet, landscape iPad, lo-res laptops ands desktops */
  }
  @media (min-width: 1025px) {
    /* big landscape tablets, laptops, and desktops */
  }
  @media (min-width: 1281px) {
    /* hi-res laptops and desktops */
  }
`;
