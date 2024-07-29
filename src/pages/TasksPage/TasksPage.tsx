import {Text, Flex, Heading, Card} from "@radix-ui/themes";
import React from "react";
import Banner from "./components/Banner";
import styled from "styled-components";
import TaskContent from "./components/TaskContent";

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
            <StyledCard>
                <Flex direction="column">
                    <Banner/>
                    <TaskContent/>
                </Flex>
            </StyledCard>
        </Flex>
    </>)
}

export default TasksPage;