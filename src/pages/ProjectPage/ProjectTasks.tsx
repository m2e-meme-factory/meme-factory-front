import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Callout,
  Flex,
  Heading,
} from '@radix-ui/themes';
import Lottie from 'lottie-react';
import comp from "../../shared/components/LottieIcons/other/shib-comp.json";
import { Project, ProjectProgress } from 'api';
import { UserRoleInProject } from './ProjectPage';
import SheetSubtaskCard from './components/SubtaskCard/SheetSubtaskCard';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import FileSection from './components/FileSection/FileSection';
import { ResponsibleImageBox } from '../../shared/components/ResponsibleImageBox';
import LottieInView from '../../shared/components/LottieIcons/InView/LottieInView';


const ProjectTasks = (props: {
  currentProject?: Project | null;
  progress: ProjectProgress | undefined;
  currentUserRole: UserRoleInProject;
}) => {

  const { currentProject, progress, currentUserRole } = props

  return (
    <>
    {/* <QuestGuideBtn /> */}
      <Flex direction='column' style={{ userSelect: 'text' }} align="center" pl="4" pr="4" pb="4" gap="4">
      <Flex justify="center" align="center" direction="column" >
          <ResponsibleImageBox>
          <LottieInView style={{ height: "100%" }} animationData={comp} />
          </ResponsibleImageBox>
          {/* <Lottie style={{ maxHeight: "40vh" }} animationData={comp} loop={true} autoplay={true} /> */}
          {/* <Heading mt="2" align="center">{currentProject?.project.title}</Heading> */}
        </Flex>
        <Flex width="100%" direction="column" gap="4">

          {/* Tasks */}
             <Flex direction='column' mb='3'>
               
          {(currentProject && currentProject?.project.files.length > 0) && 
            <Box mb="5">
              <Callout.Root color='gray' mb="2">
              <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    Don't forget to download attachments, they are needed for tasks
                  </Callout.Text>
              </Callout.Root>
              <FileSection  currentProject={currentProject} />
            </Box>
          }
               <Flex gap='3' direction='column'>
                <Callout.Root color='gray'>
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    Complete tasks to earn points
                  </Callout.Text>
                </Callout.Root>
                 {currentProject?.project.tasks &&
                  currentProject?.project.tasks.map((subtask, index) => (
                    <SheetSubtaskCard
                      key={index}
                      id={subtask.task.id}
                      description={subtask.task.description}
                      price={subtask.task.price}
                      title={subtask.task.title}
                      progress={progress}
                      userRole={currentUserRole || 'guestCreator'}
                    />
                  ))}
              </Flex>
            </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ProjectTasks;
