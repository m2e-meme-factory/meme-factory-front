// DeveloperMenu.tsx
import { Badge, Box, Button, Text, Card, Flex, Heading } from '@radix-ui/themes';
import React from 'react';
import packageJson from '../../../../package.json';

interface DeveloperMenuProps {
  onClearTutorial: () => void;
  onClearGuides: () => void;
  version: string; // Версия проекта
}

const DeveloperMenu: React.FC<DeveloperMenuProps> = ({ onClearTutorial, onClearGuides, version }) => {
  return (
    <Box asChild position="fixed" top="0" right="0" left="0" style={{ zIndex: 10 }}>
        <Card variant="classic">
            <Flex direction="column" gap="2">
                <Heading>Developer Menu</Heading>
                <Text>varsion: <Badge color='jade' variant='soft' radius='full'>{packageJson.version}</Badge></Text>
                <Button onClick={onClearTutorial}>Clear Tutorial</Button>
                <Button onClick={onClearGuides}>Clear Guides</Button>
            </Flex>
        </Card>
    </Box>
  );
};

export default DeveloperMenu;
