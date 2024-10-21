import { Button, Flex, Text, Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { DrawingPinIcon } from '@radix-ui/react-icons';
import AttachmentCard from '../AttachmentCard/AttachmentCard';
import React, { useState } from 'react';
import { Project } from 'api';
import '../../../../styles/CustomSheetsStyles.css';

interface FileSectionProps {
  currentProject: Project | null;
}

const FileSection = ({ currentProject }: FileSectionProps) => {
  const [downloadSheetVisible, setDownloadSheetVisible] = useState(false);
  const handleDownloadSheetClose = () => {
    setDownloadSheetVisible(false);
  };

  const handleDownloadSheetOpen = () => {
    setDownloadSheetVisible(true);
  };
  return (
    <Button variant='outline' mt='2' onClick={() => handleDownloadSheetOpen()}>
      <Text>Download attachments</Text>
      <Sheet
        isOpen={downloadSheetVisible}
        onClose={() => handleDownloadSheetClose()}
        detent='content-height'
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Theme style={{ width: '100%' }}>
              <Flex direction='row' gap='2' mb='2' align='center'>
                <DrawingPinIcon width='20' height='20' />
                <Text size='5'>Attachments:</Text>
              </Flex>
              <Flex direction='column' gap='2' mb='8' justify='center'>
                {currentProject?.project.files.map((file) => (
                  <AttachmentCard name={file} key={file} />
                ))}
              </Flex>
            </Theme>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => handleDownloadSheetClose()} />
      </Sheet>
    </Button>
  );
};

export default FileSection;
