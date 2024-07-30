import {Card, Flex, IconButton, Text} from "@radix-ui/themes";
import {DownloadOutlined, FileOutlined} from "@ant-design/icons";
import {FC} from "react";

interface AttachmentCardProps {
    name: string,
    url: string;
}

const AttachmentCard: FC<AttachmentCardProps> = ({name, url}) => {
    const [fileName, fileExtension] = name.split(".");

    return(<Card mt='2' mb='2'>
        <Flex align='center' justify='between'>
            <Flex>
                <FileOutlined style={{color: 'yellow', marginRight: '15px'}}/>
                <Flex direction="column">
                    <Text size='5' weight='medium'>{fileName}</Text>
                    <Text size='3' color='gray'>{fileExtension}</Text>
                </Flex>
            </Flex>
            <IconButton size='3'>
                <DownloadOutlined />
            </IconButton>
        </Flex>
    </Card>)
}

export default AttachmentCard;