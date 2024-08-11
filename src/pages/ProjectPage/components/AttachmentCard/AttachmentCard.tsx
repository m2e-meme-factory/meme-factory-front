import { Card, Flex, Text } from '@radix-ui/themes';
import { FileOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { processFileName } from '../../../../shared/utils/helpers/processFilename';

interface AttachmentCardProps {
  name: string;
}

const AttachmentCard: FC<AttachmentCardProps> = ({ name }) => {
  const { fileName, fileExtension } = processFileName(name);

  return (
    <Card mt='2' mb='2'>
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
            {fileName}
          </Text>
          <Text size='3' color='gray'>
            {fileExtension}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default AttachmentCard;
