import React, { FC, useRef } from 'react';
import styles from './CopyableRef.module.css';

const CopyableRef: FC<{ refLink: string }> = ({ refLink }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [copyButtonText, setCopyButtonText] = React.useState<string>('Copy');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyText = () => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(refLink)
          .then(() => {
            setIsCopied(true);
            setCopyButtonText('Copied');

            setTimeout(() => {
              setIsCopied(false);
              setCopyButtonText('Copy');
            }, 2000);
          })
          .catch(() => {
            console.error('Clipboard copy failed, text is selected for manual copying.');
          });
      }
    }
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
