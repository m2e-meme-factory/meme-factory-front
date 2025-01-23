import React, { useState, useRef } from "react";
import styled from "styled-components";
import { AccentButton } from "../../shared/components/Buttons/GlowingButton";
import { Callout, Flex } from "@radix-ui/themes";

// Стили для контейнера
const FileInputContainer = styled.div`
  display: inline-block;
  position: relative;
`;

// Стили для кнопки выбора файла, которая выглядит как карточка
const FileInputButton = styled(AccentButton)`
  text-overflow: ellipsis;
  width: 100%;


  &:hover {
    background: #e0e0e0;
  }

  &:focus {
    outline: none;
    border-color: var(--gray-7);
  }

  &.file-selected {
    background: var(--gray-7);
    color: white;
  }
`;

// Стили для скрытого поля input
const HiddenFileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
`;

// Стили для отображения имени выбранного файла внутри кнопки
const FileName = styled.span`
  display: block;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
`;

interface FileUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState<string | null>(null); // Состояние для хранения имени файла
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name); // Сохраняем имя файла в состоянии
      onChange(event); // Передаем событие (и файл) в родительский компонент
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();  // Симулируем клик по скрытому input
  };

  return (
    <FileInputContainer>
        <Flex direction="column" gap="2">
            <FileInputButton size="3" style={{ textTransform: 'uppercase', fontWeight: 'bold' }} className={fileName ? 'file-selected' : ''} onClick={handleButtonClick}>
                {fileName ? (
                    "Select Another"
                ) : (
                "Select Video"
                )}
            </FileInputButton>
            {fileName && (
                <Callout.Root color="gray">
                    <Callout.Text>
                        {fileName}
                    </Callout.Text>
                </Callout.Root>
            )}
            <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept=".mp4" // Ограничиваем выбор только файлами mp4
                onChange={handleFileChange}
            />
        </Flex>
    </FileInputContainer>
  );
};

export default FileUpload;
