import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Code,
  IconButton,
  TextField,
  IconButtonProps,
  Box,
} from "@radix-ui/themes";
import React from "react";
import { useEffect, useRef, useState } from "react";

interface CopyableTextFieldProps extends IconButtonProps {
  value: string;
  fieldSize?: "1" | "2" | "3";
}

const CopyableTextField = ({
  value,
  fieldSize,
  ...props
}: CopyableTextFieldProps) => {
  const [icon, setIcon] = useState("copy");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {

    if (inputRef.current){
      inputRef.current.select();
    }
    
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIcon("check");

        setTimeout(() => {
          setIcon("copy");
        }, 1000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <TextField.Root
      placeholder="Search the docs…"
      size={fieldSize}
      value={value}
      style={fieldSize == "3" ? { height: "50px" } : {}}
      ref={inputRef}
    >
      <TextField.Slot></TextField.Slot>
      <TextField.Slot>
        <IconButton {...props} onClick={handleCopy}>
          {icon === "copy" ? <CopyIcon /> : <CheckIcon />}
        </IconButton>
      </TextField.Slot>
    </TextField.Root>

    // <Flex align="center" gap="2" justify={"between"}>
    //   <IconButton
    //     aria-label="Copy value"
    //     variant="solid"
    //     size={value}
    //     onClick={handleCopy}
    //   >
    //     {icon === "copy" ? <CopyIcon /> : <CheckIcon />}
    //   </IconButton>
    // </Flex>
  );
};

export default CopyableTextField;
