import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  Dialog,
  TextArea,
  Separator,
  Box,
  Theme,
  IconButton,
  Callout,
  ScrollArea,
} from '@radix-ui/themes';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './ProjectPage.module.css';
import TaskDescriptionDisplay from './components/Description/DescriptionSection';
import { useGetProject } from '../../shared/utils/api/hooks/project/useGetProject';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { setProject } from '../../shared/utils/redux/project/projectSlice';
import { Project, ProjectProgress } from 'api';
import { useApplyForProject } from '../../shared/utils/api/hooks/project/useApplyForProject';
import { useGetProgress } from '../../shared/utils/api/hooks/project/useGetProjectProgress';
import fallbackBanner from './../../shared/imgs/fallbackBanner.png';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import { Role } from '../../shared/consts/userRoles';
import { shortenString } from '../../shared/utils/helpers/shortenString';
import { BASE_URL } from '../../shared/consts/baseURL';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import SheetSubtaskCard from './components/SubtaskCard/SheetSubtaskCard';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { DrawingPinIcon, InfoCircledIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { Sheet } from 'react-modal-sheet';
import styled from 'styled-components';
import AttachmentCard from './components/AttachmentCard/AttachmentCard';
import QuestGuide from './components/QuestGuide/QuestGuide';
import FileSection from './components/FileSection/FileSection';
import ShibaAnimated from '../../shared/components/LottieIcons/Shiba/Shiba';
import Lottie from 'lottie-react';
import shiba from "../../shared/components/LottieIcons/Shiba/shiba.json";
import PreProjectPage, { getSeenProjectGuide, setSeenProjectGuide } from './PreProjectPage';
import ProjectOverivew from './ProjectOverivew';
import ProjectTasks from './ProjectTasks';
import SwipableTabs from '../../shared/components/useSwipableTabs';
import useSwipableTabs from '../../shared/components/useSwipableTabs';
import { GuideList } from './components/QuestGuide/GuideList';
import ProjectHistory from '../ProjectHistory/ProjectHistory';

export type UserRoleInProject =
  | 'projectOwner'
  | 'guestAdvertiser'
  | 'guestCreator'
  | 'projectMember'
  | 'unconfirmedMember';

const FixedHelpButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 5;
`;


const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleInProject>('guestCreator');
  const [progress, setProgress] = useState<ProjectProgress>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isShowGuide, setShowGuide] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

  const user = useSelector((state: RootState) => state.user.user);

  const { data: projectInfoResponse, isLoading } = useGetProject(id);
  const { data: progressesResponse, isLoading: isProjectProgressLoading } = useGetProgress({
    projectId: id ?? '',
    userId: user?.id,
  });


  useEffect(() => {
    const seen = getSeenProjectGuide(id?.toString() ?? '');
    setShowGuide(!seen);

    if (currentUserRole === 'projectOwner') return setTabIndex(1);
    if (currentUserRole === 'projectMember') return setTabIndex(2);

    if (seen) setTabIndex(1);
  }, [currentUserRole])

  useEffect(() => {
    if (projectInfoResponse) {
      setCurrentProject(projectInfoResponse.data);
      dispatch(setProject(projectInfoResponse.data));
    }
  }, [projectInfoResponse, dispatch]);

  useEffect(() => {
    if (progressesResponse && progressesResponse.data.length === 1) {
      const userProgress = progressesResponse.data[0];
      setProgress(userProgress);
      if (userProgress) {
        setCurrentUserRoleFromProgress(userProgress.status);
      }
    }
  }, [progressesResponse]);

  useEffect(() => {
    if (user && currentProject) {
      determineUserRole(user, currentProject);
    }
  }, [user, currentProject]);


  const determineUserRole = (user: RootState['user']['user'] | undefined, project: Project) => {
    if (!user) return;

    if (user.role === Role.ADVERTISER) {
      setCurrentUserRole(user.id === project.project.authorId ? 'projectOwner' : 'guestAdvertiser');
    } else {
      if (currentUserRole !== 'projectOwner' && currentUserRole !== 'guestAdvertiser') {
        if (currentUserRole === 'projectMember' || currentUserRole === 'unconfirmedMember') {
          return;
        }
        setCurrentUserRole('guestCreator');
      }
    }
  };

  const setCurrentUserRoleFromProgress = (status: string) => {
    if (status === 'accepted') {
      setCurrentUserRole('projectMember');
    } else if (status === 'pending') {
      setCurrentUserRole('unconfirmedMember');
    } else {
      setCurrentUserRole('guestCreator');
    }
  };

  if (isLoading || isProjectProgressLoading) {
    return <Loading />;
  }

  return (
    <>
      <SwipableTabs
        tabs={[
          {
            name: (<InfoCircledIcon color="var(--accent-indicator)" width="1.25rem" height="auto" />),
            scrollable: false,
            slideClass: "screen-without-tabs",
            component: (
              <PreProjectPage projectId={currentProject?.project.id || ""} btnClickHandler={() => {
                setShowGuide(false);
                setTabIndex(1);
              }} />
            )
          },
          {
            name: 'Overview',
            scrollable: true,
            slideClass: "screen-without-tabs",
            component: (
              <ProjectOverivew
                currentProject={currentProject}
                setCurrentUserRole={setCurrentUserRole}
                btnClickHandler={() => { }}
              />
            ),
          },
          {
            name: "Tasks",
            scrollable: true,
            component: <ProjectTasks
              currentProject={currentProject}
              currentUserRole={currentUserRole}
              progress={progress}
            />,
          },
          {
            name: "History",
            scrollable: false,
            slideClass: "screen-without-tabs",
            component: (currentProject) ? (
              <ProjectHistory currentProject={currentProject} user={undefined} />
            ) : (
              <Loading />
            )
          },
          ...(
            currentUserRole == 'projectOwner' ?
            [
              {
                name: (
                    <Pencil2Icon 
                      color="var(--accent-indicator)" 
                      width="1.25rem" 
                      height="auto"
                      onClick={() => navigate('details')} 
                    />
                ),
                scrollable: false,
                slideClass: "screen-without-tabs",
                component: (
                  <></>
                )
              }
            ] : []
          )
        ]

        }
        currentTabIndex={tabIndex}
        justifyTabs="center"
      />
      <Button />
    </>
  );
};


export default ProjectPage;
