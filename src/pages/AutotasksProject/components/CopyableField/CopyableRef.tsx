import React, { FC } from 'react';
import { Box } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

import { AccentButton } from '@shared/components/Buttons/GlowingButton';
import { LOCAL_TEXT } from '@shared/consts';

const CopyableRef: FC<{ refLink: string }> = ({ refLink }) => {
  const { t } = useTranslation();
  const [copyButtonText, setCopyButtonText] = React.useState<string>(t(LOCAL_TEXT.COPY));

  const handleCopyText = () => {
    const textToCopy = refLink;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopyButtonText(t(LOCAL_TEXT.COPIED));

          setTimeout(() => {
            setCopyButtonText(t(LOCAL_TEXT.COPY));
          }, 2000);
        })
        .catch(() => {
          console.error(t(LOCAL_TEXT.CLIPBOARD_COPY_FAILED_USING_FALLBACK_METHOD));
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
      setCopyButtonText(t(LOCAL_TEXT.COPIED));

      setTimeout(() => {
        setCopyButtonText(t(LOCAL_TEXT.COPY));
      }, 2000);
    } catch (error) {
      console.error(t(LOCAL_TEXT.FALLBACK_COPY_FAILED), error);
    }

    document.body.removeChild(tempInput);
  };

  return (
    <Box asChild>
      <AccentButton onClick={handleCopyText} size='4'>
        {copyButtonText}
      </AccentButton>
    </Box>
  );
};

export default CopyableRef;
