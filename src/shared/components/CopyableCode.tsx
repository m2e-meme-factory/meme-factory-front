import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { Code, Flex, IconButton } from '@radix-ui/themes';
import React, { useState } from 'react';

interface CopyableCodeProps {
  value: string
}

const CopyableCode = ({ value }: CopyableCodeProps) => {
  const [icon, setIcon] = useState('copy'); // State to manage which icon to display

  const handleCopy = () => {
    // Copy value to clipboard
    navigator.clipboard.writeText(value).then(() => {
      setIcon('check'); // Set the icon to CheckIcon on success

      // Revert back to CopyIcon after 1 second
      setTimeout(() => {
        setIcon('copy');
      }, 1000);
    }).catch((error) => {
      console.error('Failed to copy text: ', error);
    });
  };

  return (
    <Flex align="center" gap="2">
      <Code variant="ghost">{value}</Code>
      <IconButton
        size="1"
        aria-label="Copy value"
        color="gray"
        variant="ghost"
        onClick={handleCopy}
      >
        {icon === 'copy' ? <CopyIcon /> : <CheckIcon />}
      </IconButton>
    </Flex>
  );
};

export default CopyableCode;


