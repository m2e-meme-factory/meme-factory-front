import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import CreatorsProjects from './components/CreatorsProjects';
import AdvertisersProjects from './components/AdvertisersProjects';

const MyProjectsPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);

  console.log(currentUser);
  return (
    <>
      {currentUser?.role === 'creator' && <CreatorsProjects user={currentUser} />}
      {currentUser?.role === 'advertiser' && <AdvertisersProjects user={currentUser} />}
    </>
  );
};

export default MyProjectsPage;
