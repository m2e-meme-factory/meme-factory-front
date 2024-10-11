import styled from 'styled-components';
import { Box, Button, Card, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import CardBanner from '../CardBanner/CardBanner';
import ProjectCardContent from '../ProjectCardContent/ProjectCardContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined, TagsOutlined } from '@ant-design/icons';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  border: 1px solid var(--yellow-9);
  background-color: var(--gray-2);
`;

const SecondaryHeading = styled(Heading)`
  font-family: var(--default-font) !important;
  text-transform: none;
`;

const GlowingCard = styled(Card)`
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

const AutoTasksProjectCard = () => {
  const navigate = useNavigate();

  return (
    <GlowingCard className='SubtaskCard' mb='3' onClick={() => navigate(`/projects/autotasks`)}>
      <Flex align='center' justify='between' p='1' pb='4' pt='4'>
        <Flex align='center'>
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"></path></svg>
          {/* <RocketOutlined style={{ color: 'yellow', marginRight: '15px', fontSize: '24px' }} /> */}
          <Heading ml="3">FAST TASKS</Heading>
        </Flex>
        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </Flex>
    </GlowingCard>

    // <StyledCard className='glowing' variant='classic' onClick={() => navigate(`/projects/autotasks`)}>
    //   <Flex direction='column'>
    //     <CardBanner />
    //     <Flex direction='column' m='4'>
    //       <SecondaryHeading>Airdrop Tasks</SecondaryHeading>
    //       {/* <Text mb='3' color='yellow' weight='medium'>
    //         Platform tasks
    //       </Text> */}
    //       {/* <Flex mb='3'>
    //         <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
    //         <Text weight='medium'>
    //           Tags:{' '}
    //           {['partnership', 'socials'].map((tag, index) => (
    //             <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
    //               {tag}
    //             </span>
    //           ))}
    //         </Text>
    //       </Flex> */}
    //     </Flex>
    //   </Flex>
    // </StyledCard>
  );
};

export default AutoTasksProjectCard;
