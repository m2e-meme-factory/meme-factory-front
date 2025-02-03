import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { FileOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { processFileName } from '@shared/utils/helpers/processFilename';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

import { env } from '@shared/consts/env';

interface AttachmentCardProps {
  name: string;
}

const AttachmentCard: FC<AttachmentCardProps> = ({ name }) => {
  const { fileName, fileExtension } = processFileName(name);
  const downloadUrl = env.baseUrl + '/uploads/projects/' + name;
  const WebApp = useWebApp();

  const handleDownloadClick = () => {
    WebApp.openLink(downloadUrl);
  };

  return (
    <Card mt='2' mb='2'>
      <Flex align='center' justify='between'>
        <Flex>
          <FileOutlined style={{ color: 'yellow', marginRight: '15px' }} />
          <Flex direction='column'>
            <Text
              size='5'
              weight='medium'
              wrap='pretty'
              style={{
                maxWidth: '70vw',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fileName}
            </Text>
            <Text size='3' color='gray'>
              {fileExtension}
            </Text>
          </Flex>
        </Flex>
        <IconButton onClick={() => handleDownloadClick()}>
          <DownloadIcon />
        </IconButton>
      </Flex>
    </Card>
  );
};

export default AttachmentCard;
