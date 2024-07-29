import {Flex, Heading, Text} from "@radix-ui/themes";
import {task} from "../../../consts/task-example"
import styled from "styled-components";
import {DollarOutlined, TagsOutlined} from "@ant-design/icons";
import React from "react";

const TaskContentHeading = styled(Heading)`
    color: black;
`

const TaskContentText = styled(Text)`
    color: ${props => props.color || 'black'};
    weight: ${props => props.weight || 'regular'};
`

const TaskContent = () => {
    return (<Flex direction="column" m="4">
        <TaskContentHeading>{task.title}</TaskContentHeading>
        <TaskContentText color="gray" weight="medium">{task.category}</TaskContentText>
        <Flex>
            <TagsOutlined style={{color: 'black', marginRight: '8px'}} />
            <TaskContentText weight="medium">
                Tags: {task.tags.map((tag, index) => (
                <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                        {tag}
                    </span>
            ))}
            </TaskContentText>
        </Flex>
        <Flex>
            <DollarOutlined style={{color: 'black', marginRight: '8px'}}/>
            <TaskContentText weight="medium" >Price: 1000</TaskContentText>
        </Flex>
    </Flex>)
}

export default TaskContent;