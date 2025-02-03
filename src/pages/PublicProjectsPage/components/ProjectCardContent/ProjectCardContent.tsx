import { Badge, Box, Flex } from '@radix-ui/themes';

import { FC } from 'react';
import { ProjectData } from 'api';

interface ProjectCardContentProps {
  project: ProjectData;
  minPrice?: string | null;
  maxPrice?: string | null;
}

const ProjectCardContent: FC<ProjectCardContentProps> = ({ project, minPrice, maxPrice }) => {
  return (
    <Flex justify='end' direction='column'>
      <Box>
        {minPrice && maxPrice && (
          <Flex justify='end'>
            <Box
              pt='2'
              style={{
                color: 'var(--gray-10)',

                fontSize: 'var(--font-size-2)',
                fontStyle: 'italic',
              }}
            >
              {project.tasks
                .map((t) => Number(t.task.price))
                .reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                }, 0)}
              <Badge color='bronze' ml='1' size='1'>
                M2E
              </Badge>
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default ProjectCardContent;
