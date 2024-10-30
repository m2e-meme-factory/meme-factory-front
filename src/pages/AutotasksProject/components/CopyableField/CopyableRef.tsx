import React, { FC } from 'react';
import { Box, Button } from '@radix-ui/themes';

const CopyableRef: FC<{ refLink: string }> = ({ refLink }) => {
  const [copyButtonText, setCopyButtonText] = React.useState<string>('Copy');

  const handleCopyText = () => {
    const textToCopy = refLink;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopyButtonText('Copied');

          setTimeout(() => {
            setCopyButtonText('Copy');
          }, 2000);
        })
        .catch(() => {
          console.error('Clipboard copy failed, using fallback method.');
          copyFallback(textToCopy);
        });
    } else {
      copyFallback(textToCopy);
    }
  };

  const copyFallback = (text: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, text.length);

    try {
      document.execCommand('copy');
      setCopyButtonText('Copied');

      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    } catch (error) {
      console.error('Fallback copy failed.', error);
    }

    document.body.removeChild(tempInput);
  };

  return (
    <Box asChild width='100%'>
      <Button onClick={handleCopyText} size='4'>
        {copyButtonText}
      </Button>
    </Box>
  );
};

export default CopyableRef;
