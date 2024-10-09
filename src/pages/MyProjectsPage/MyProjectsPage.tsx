import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import AdvertisersProjects from './components/AdvertisersProjects';

const MyProjectsPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);

  return <>{currentUser?.role === 'advertiser' && <AdvertisersProjects user={currentUser} />}</>;
};

export default MyProjectsPage;
