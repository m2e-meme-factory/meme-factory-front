import {Card, Flex} from "@radix-ui/themes";
import CardBanner from "../CardBanner/CardBanner";
import TaskContent from "../TaskContent/TaskContent";
import React from "react";
import styled from "styled-components";

const TaskCard = () => {

    const StyledCard = styled(Card)`
        padding: 0;
        margin: 0 0 15px;
        width: 100%;
        background-color: #121212;
    `;

    return (
        <StyledCard>
            <Flex direction="column">
                <CardBanner/>
                <TaskContent/>
            </Flex>
        </StyledCard>
    );
}

export default TaskCard;