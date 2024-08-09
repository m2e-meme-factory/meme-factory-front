import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { downloadImage } from '../../../../shared/utils/api/requests/files/downloadFile';

interface AttachmentCardProps {
  name: string;
  url: string;
}

const AttachmentCard: FC<AttachmentCardProps> = ({ name, url }) => {
  const [fileName, fileExtension] = name.split('.');

  return (
    <Card mt='2' mb='2'>
      <Flex align='center' justify='between'>
        <Flex>
          <FileOutlined style={{ color: 'yellow', marginRight: '15px' }} />
          <Flex direction='column'>
            <Text size='5' weight='medium'  wrap="pretty"
                  style={{
                    maxWidth: '70vw',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
              {fileName.substring(37)}
            </Text>
            <Text size='3' color='gray'>
              {fileExtension}
            </Text>
          </Flex>
        </Flex>
        <IconButton size='3' onClick={() => (downloadImage(`https://api.meme-factory.site/uploads/projects/${name}`))}>
          <DownloadOutlined />
        </IconButton>
      </Flex>
    </Card>
  );
};

export default AttachmentCard;
