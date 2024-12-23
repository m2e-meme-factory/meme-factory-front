import { Flex, Heading, Badge, Select } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { RootState } from "../../shared/utils/redux/store";
import { Link } from "react-router-dom";

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}



export default function Header() {

    const user = useSelector((state: RootState) => state.user.user);

    return (
        <Flex justify="between" align="center">
            <Link
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                to='/wallet'
            >
                <Heading align="center">{numberWithSpaces(user ? Number(user.balance) : 0)} <Badge size="3" color="bronze">XP</Badge></Heading>

            </Link>
            {/* <img
                src={`${process.env.PUBLIC_URL}/imgs/ru.png`}
                style={{
                  objectFit: 'cover',
                  height: '100%',
                }}
              /> */}
            <Select.Root defaultValue="en" size="2">
                <Select.Trigger variant="ghost" color='gray' />
                <Select.Content color="gray">
                    <Select.Item value="en"><img alt="En" src={`${process.env.PUBLIC_URL}/imgs/en.png`} height="24px" style={{ marginBottom: "-7px" }} /></Select.Item>
                    <Select.Item value="ru"><img alt="Ru" src={`${process.env.PUBLIC_URL}/imgs/ru.png`} height="24px" style={{ marginBottom: "-7px" }} /></Select.Item>
                </Select.Content>
            </Select.Root>
            {/* <SegmentedControl.Root defaultValue="en">
          <SegmentedControl.Item value="en">🇬🇧 En</SegmentedControl.Item>
          <SegmentedControl.Item value="ru">🇷🇺 Ru</SegmentedControl.Item>
        </SegmentedControl.Root> */}
        </Flex>
    );
}