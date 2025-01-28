import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RightOutlined } from '@ant-design/icons';

import { LOCAL_TEXT } from '@shared/consts';

import styles from './SocialsLink.module.css';

interface SocialsLinkProps {
  icon: ReactNode;
  socialsName: string;
  url: string;
}

const SocialsLink: FC<SocialsLinkProps> = ({ icon, socialsName, url }) => {
  const { t } = useTranslation();

  return (
    <>
      <a href={url} target='_blank' className={styles.link} rel='noreferrer'>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.websiteInfo}>
              {icon}
              <p className={styles.socialsName}>
                {t(LOCAL_TEXT.GO_TO)} {socialsName}
              </p>
            </div>
            <RightOutlined style={{ color: '#83a4a4' }} />
          </div>
        </div>
      </a>
      <p className={styles.warning}>{t(LOCAL_TEXT.UNSUBSCRIBE_WARNING)}</p>
    </>
  );
};

export default SocialsLink;
