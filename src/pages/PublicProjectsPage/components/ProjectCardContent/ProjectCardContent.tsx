import { Badge, Box, Flex, Heading, Text } from '@radix-ui/themes';
import { TagsOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { ProjectData } from 'api';
import styled from 'styled-components';

interface ProjectCardContentProps {
  project: ProjectData;
  minPrice?: string | null;
  maxPrice?: string | null;
}

const SecondaryHeading = styled(Heading)`
  /* font-family: 'ME', sans-serif !important; */
  text-transform: uppercase;
`;

const ProjectCardContent: FC<ProjectCardContentProps> = ({ project, minPrice, maxPrice }) => {
  return (
    <Flex justify='between' direction='column'>
      {/* <Box> */}
        {/* <Flex display="flex" direction="column" align="end">
          <Text mb='3' color='yellow' weight='medium'>
            {project.category}
          </Text>
        </Flex>
        <Flex display="flex" direction="column" align="end">
          <Text weight='medium'>
            {project.tags.map((tag, index) => (
              <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                {tag}
              </span>
            ))}
          </Text>
        </Flex> */}
      {/* </Box> */}

      <Box>
        {minPrice && maxPrice && (
          <Box>
            {/* <Text size="1" color='gray'>
            Reward:
            </Text> */}
            <Box
              pt='2'
              style={{
                color: 'var(--gray-10)',
                // borderRadius: "1rem",
                // border: "1px solid var(--gray-10)",
                fontSize: 'var(--font-size-2)',
                fontStyle: 'italic',
              }}
            >
              {/* {minPrice} - {maxPrice} */}+
              {project.tasks
                .map((t) => Number(t.task.price))
                .reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                }, 0)}
              <Badge color='bronze' ml='1' size='1'>
                M2E
              </Badge>
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
    // <Flex direction='column'>

    //   {/* <SecondaryHeading>{project.title}</SecondaryHeading> */}
    //   <Flex direction='row' justify='start' align='center'>
    //     <Text mb='3' color='yellow' weight='medium'>
    //       {project.category + ':'}
    //     </Text>
    //     <Flex mb='3' ml='2'>
    //       <Text weight='medium'>
    //         {project.tags.map((tag, index) => (
    //           <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
    //             {tag}
    //           </span>
    //         ))}
    //       </Text>
    //     </Flex>
    //   </Flex>
    // </Flex>
  );
};

export default ProjectCardContent;
