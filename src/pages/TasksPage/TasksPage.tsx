import {Text, Flex, Heading, Card} from "@radix-ui/themes";
import React from "react";
import CardBanner from "./components/CardBanner/CardBanner";
import styled from "styled-components";
import TaskContent from "./components/TaskContent/TaskContent";
import TaskCard from "./components/TaskCard/TaskCard";

const TasksPage = () => {
    const StyledCard = styled(Card)`
    padding: 0;
    margin: 0;
    width: 100%;
    background-color: #fecf0a;
`;

    return (<>
        <Flex m="4" direction="column">
            <Heading>Recent Tasks</Heading>
            <Text color="gray">Earn M2E by completing them</Text>
        </Flex>
        <Flex m="4" direction="column">
            <TaskCard/>
        </Flex>
    </>)
}

export default TasksPage;