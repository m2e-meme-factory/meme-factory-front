import { Dispatch, SetStateAction, useState } from 'react';
import {
  Badge,
  Box,
  Callout,
  Flex,
  Heading,
  Separator,
  TextArea,
  Theme,
  Text,
  Card
} from '@radix-ui/themes';
import Lottie from 'lottie-react';
import shibStrong from "../../shared/components/LottieIcons/other/shib-strong.json";
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import TaskDescriptionDisplay from './components/Description/DescriptionSection';
import { useApplyForProject } from '../../shared/utils/api/hooks/project/useApplyForProject';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import { Project, ProjectProgress } from 'api';
import { UserRoleInProject } from './ProjectPage';
import { Sheet } from 'react-modal-sheet';
import { ResponsibleImageBox } from '../../shared/components/ResponsibleImageBox';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { shortenString } from '../../shared/utils/helpers/shortenString';


const ProjectOverivew = (props: {
  currentProject?: Project | null
  progress?: ProjectProgress | null
  setCurrentUserRole: Dispatch<SetStateAction<UserRoleInProject>>
  btnClickHandler?: () => void
}) => {

  const { currentProject, progress, setCurrentUserRole, btnClickHandler } = props

  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<string>('');
  const [applyBlocked, setApplyBlocked] = useState<boolean>(false);
  const { mutate: applyMutation } = useApplyForProject(
    setIsApplyLoading,
    setApplyBlocked,
    setCurrentUserRole
  );

  const handleApplyClick = () => {
    setIsApplyLoading(true);
    if (currentProject) {
      if (applicationMessage.trim() === '') {
        showErrorMessage('Application message cannot be empty or just whitespace.');
        setIsApplyLoading(false);
        return;
      }

      applyMutation({
        params: {
          projectId: currentProject.project.id,
          message: applicationMessage,
        },
      });
      setIsModalVisible(false);
    }
  };
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplicationMessage(event.target.value);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Flex direction='column' style={{ userSelect: 'text', paddingBottom: '108px' }} align="center" pl="4" pr="4" gap="4">
        <Flex justify="center" align="center" direction="column" >
          <ResponsibleImageBox>
            <Lottie style={{ height: "100%" }} animationData={shibStrong} loop={true} autoplay={true} />
          </ResponsibleImageBox>
          <Heading align="center">{currentProject?.project.title}</Heading>
          { }
          <Text align="center" size="2" color='gray'>Read the Quest Overivew to continue</Text>
        </Flex>
        <Flex width="100%" direction="column" gap="4">

          <TaskDescriptionDisplay description={currentProject?.project.description || ''} />

          
          { progress?.status != "accepted" && 
          <Box asChild p="4" position="fixed" bottom="0" left="0" right="0">
            <Card >
              {
                (progress?.status == "pending") ?
                 (
                  <Callout.Root color="green">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text size="2">
                      Join required is pending... <br />
                      You can already begin with task completion
                    </Callout.Text>
                  </Callout.Root>
                ) :
                (<GlowingButton
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                  disabled={isApplyLoading}
                  size='4'
                  style={{
                    width: '100%',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                  }}
                >
                  Join
                </GlowingButton>
                )
              }
            </Card>
          </Box>

}



          {/* Category and tags */}
          <Box>
            <Flex align='center' direction='row' mb='2'>
              {currentProject?.project && (
                <>
                  <Text weight='medium' mr='2'>
                    {currentProject.project.category?.toUpperCase()}
                  </Text>
                  <Separator mr='2' orientation='vertical' />
                  <Text weight='medium' size='5'>
                    {currentProject.project.tags?.map((tag, index) => (
                      <Badge size='3' key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                        {tag.toUpperCase()}
                      </Badge>
                    ))}
                  </Text>
                </>
              )}
            </Flex>

            {/* Host */}
            <Flex direction='row' align='center'>
              <Flex
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '13px',
                  background: 'var(--gray-2)',
                }}
                mr='2'
                align='center'
                justify='center'
              >
                <Text weight='bold' size='5'>
                  {shortenString(
                    currentProject
                      ? currentProject.project.author.username
                        ? currentProject.project.author.username[0].toUpperCase()
                        : `User ${currentProject.project.author.telegramId}`[0].toUpperCase()
                      : 'Meme factory'[0].toUpperCase()
                  )}
                </Text>
              </Flex>

              <Text weight='medium' size='6'>
                {shortenString(
                  currentProject
                    ? currentProject.project.author.username
                      ? currentProject.project.author.username
                      : `User ${currentProject.project.author.telegramId}`
                    : 'Meme factory'
                )}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Sheet isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} detent='content-height' style={{ zIndex: 1 }}>
        <Theme appearance='dark'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>

              <Box p='4' pb='8' width="100%">
                <Flex direction='column' gap='2'>
                  <Heading mb='4' align='center' size='6'>
                    Join quest now!
                  </Heading>
                  <TextArea
                    style={{ height: '20vh' }}
                    size='2'
                    placeholder='Write join message as mentioned in Requirements'
                    value={applicationMessage}
                    onChange={handleTextAreaChange}
                  />

                  <Flex gap='3' mt='4' justify='end'>

                  </Flex>
                  <GlowingButton
                    mt="2"
                    size="4"
                    // loading={isApplyLoading}
                    // disabled={applicationMessage.length === 0}
                    onClick={handleApplyClick}
                  >
                    Begin Quest
                  </GlowingButton>
                </Flex>
              </Box>

            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => setIsModalVisible(false)} />
        </Theme>
      </Sheet>
    </>
  );
};

export default ProjectOverivew;
