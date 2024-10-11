import { Flex, Text } from "@radix-ui/themes"
import { ResponsibleImage } from "./ResponsibleImage"
import eyes from "../../shared/imgs/eyes.webp";

const NothingFound = () => {
    return (
        <Flex minHeight="50vh" align="center" justify="center" direction="column">
            <ResponsibleImage src={eyes} />
            <Text align="center">
                Nothing was found...
            </Text>
        </Flex>
    )
}

export default NothingFound;