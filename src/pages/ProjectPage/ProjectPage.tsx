import { useEffect, useState } from 'react';
import { Button } from '@radix-ui/themes';
import { InfoCircledIcon, Pencil2Icon } from '@radix-ui/react-icons';

import PreProjectPage, { getSeenProjectGuide } from './PreProjectPage';
import ProjectOverivew from './ProjectOverivew';
import ProjectHistory from '../ProjectHistory/ProjectHistory';
import ProjectTasks from './ProjectTasks';

import { useGetProject } from '@shared/utils/api/hooks/project/useGetProject';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@shared/utils/redux/store';
import Loading from '@shared/components/Loading';
import { setProject } from '@shared/utils/redux/project/projectSlice';
import { Project, ProjectProgress } from 'api';
import { useGetProgress } from '@shared/utils/api/hooks/project/useGetProjectProgress';
import { Role } from '@shared/consts/userRoles';
import SwipableTabs from '@shared/components/useSwipableTabs';

export type UserRoleInProject =
  | 'projectOwner'
  | 'guestAdvertiser'
  | 'guestCreator'
  | 'projectMember'
  | 'unconfirmedMember';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || '';

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleInProject>('guestCreator');
  const [progress, setProgress] = useState<ProjectProgress>();

  const [tabIndex, setTabIndex] = useState(0);

  const user = useSelector((state: RootState) => state.user.user);

  const { data: projectInfoResponse, isLoading } = useGetProject(id);
  const { data: progressesResponse, isLoading: isProjectProgressLoading } = useGetProgress({
    projectId: id ?? '',
    userId: user?.id,
  });

  useEffect(() => {
    const seen = getSeenProjectGuide(id?.toString() ?? '');

    if (defaultTab == 'guide') return setTabIndex(0);
    if (defaultTab == 'overview') return setTabIndex(1);
    if (defaultTab == 'tasks') return setTabIndex(2);
    if (defaultTab == 'history') return setTabIndex(3);

    if (currentUserRole === 'projectOwner') return setTabIndex(1);
    if (currentUserRole === 'projectMember') return setTabIndex(2);

    if (seen) setTabIndex(1);
  }, [currentUserRole]);

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
            name: <InfoCircledIcon color='var(--accent-indicator)' width='1.25rem' height='auto' />,
            scrollable: false,
            slideClass: 'screen-without-tabs',
            component: (
              <PreProjectPage
                projectId={currentProject?.project.id || ''}
                btnClickHandler={() => {
                  setTabIndex(1);
                }}
              />
            ),
          },
          {
            name: 'Overview',
            scrollable: true,
            slideClass: 'screen-without-tabs',
            component: (
              <ProjectOverivew
                progress={progress}
                currentProject={currentProject}
                setCurrentUserRole={setCurrentUserRole}
                btnClickHandler={() => {}}
              />
            ),
          },
          {
            name: 'Tasks',
            scrollable: true,
            component: (
              <ProjectTasks
                currentProject={currentProject}
                currentUserRole={currentUserRole}
                progress={progress}
              />
            ),
          },
          {
            name: 'History',
            scrollable: false,
            slideClass: 'screen-without-tabs',
            component: currentProject ? (
              <ProjectHistory currentProject={currentProject} user={user} />
            ) : (
              <Loading />
            ),
          },
          ...(currentUserRole == 'projectOwner'
            ? [
                {
                  name: (
                    <Pencil2Icon
                      color='var(--accent-indicator)'
                      width='1.25rem'
                      height='auto'
                      onClick={() => navigate('details')}
                    />
                  ),
                  scrollable: false,
                  slideClass: 'screen-without-tabs',
                  component: <></>,
                },
              ]
            : []),
        ]}
        currentTabIndex={tabIndex}
        justifyTabs='center'
      />
      <Button />
    </>
  );
};

export default ProjectPage;
