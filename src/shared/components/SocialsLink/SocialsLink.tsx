import styles from './SocialsLink.module.css';
import { FC, ReactNode } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { UNSUBSCRIBE_WARNING } from '../../consts/strings';

interface SocialsLinkProps {
  icon: ReactNode;
  socialsName: string;
  url: string;
}

const SocialsLink: FC<SocialsLinkProps> = ({ icon, socialsName, url }) => {
  return (
    <>
      <a href={url} target='_blank' className={styles.link}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.websiteInfo}>
              {icon}
              <p className={styles.socialsName}>Go to {socialsName}</p>
            </div>
            <RightOutlined style={{ color: '#83a4a4' }} />
          </div>
        </div>
      </a>
      <p className={styles.warning}>{UNSUBSCRIBE_WARNING}</p>
    </>
  );
};

export default SocialsLink;
