import React, { FC, useRef } from 'react';
import styles from './CopyableRef.module.css';

const CopyableRef: FC<{ refLink: string }> = ({ refLink }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [copyButtonText, setCopyButtonText] = React.useState<string>('Copy');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyText = () => {
    if (inputRef.current) {
      const textToCopy = inputRef.current.value;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(true);
            setCopyButtonText('Copied');

            setTimeout(() => {
              setIsCopied(false);
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
      setIsCopied(true);
      setCopyButtonText('Copied');

      setTimeout(() => {
        setIsCopied(false);
        setCopyButtonText('Copy');
      }, 2000);
    } catch (error) {
      console.error('Fallback copy failed.', error);
    }

    document.body.removeChild(tempInput);
  };

  return (
    <div className={styles.refLinkContainer}>
      <h4 className={styles.title}>Your referral link:</h4>
      <div className={styles.inputContainer}>
        <input className={styles.refInput} defaultValue={refLink ?? ' '} ref={inputRef} readOnly />
        <button
          className={isCopied ? styles.copiedButton : styles.copyButton}
          onClick={handleCopyText}
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default CopyableRef;
