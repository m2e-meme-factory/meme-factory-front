import {Button, Card, Flex, Text} from "@radix-ui/themes";
import React, {FC, useState} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from "@radix-ui/react-icons";
import './index.css'
import {RocketOutlined} from "@ant-design/icons";
import {task} from "../../../../shared/consts/task-example";
import {shortenDescription} from "../../../../shared/utils/helpers/shortenDescription";
import ModalSubtaskInfo from "./ModalSubtaskInfo";
import ModalSubtaskForm from "./ModalSubtaskForm";

interface TaskCardProps {
    id: number;
    title: string;
    description: string;
    price: number;
}

const SubtaskCard: FC<TaskCardProps> = ({ id, title, description, price }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSendProposalClick = () => {
        setIsFormVisible(!isFormVisible);
    }

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            setIsFormVisible(false);
        }
    }

    return (
        <Dialog.Root  onOpenChange={handleDialogOpenChange}>
            <Dialog.Trigger asChild>
                <Card className="SubtaskCard">
                    <Flex>
                        <RocketOutlined style={{ color: 'yellow', marginRight: '15px'}} />
                        <Flex direction="column">
                            <Text size='5' weight='medium'>{title}</Text>
                            <Text weight='medium'><Text color="yellow">Price:</Text> {price}$</Text>
                        </Flex>
                    </Flex>
                </Card>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay"/>
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle"><span className="Accent">Subtask:</span> {title}</Dialog.Title>
                    {isFormVisible ?
                        <>
                            <ModalSubtaskForm/>
                        </>
                        :
                        <>
                            <ModalSubtaskInfo id={id} title={title} description={description} price={price}/>
                            <button className="ProposalButton" onClick={handleSendProposalClick}>
                                <Text>Send Proposal</Text>
                            </button>
                        </>
                    }
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <Cross2Icon/>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default SubtaskCard;
