import { Flex, Heading, Badge, Select } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { RootState } from "../../shared/utils/redux/store";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function Header() {

    const user = useSelector((state: RootState) => state.user.user);
    const [lang, setLang] = useState("en")

    const handleChangeLanguage = (lang: string) => {
        localStorage.setItem('lang', lang);
        setLang(lang)
    }

    useEffect(() => {
        const l = localStorage.getItem('lang')
        if (l) {
            handleChangeLanguage(l)
        }
        console.log(l)
    }, [])

    return (
        <Flex justify="between" align="center">
            <Link
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'flex', gap: '5px' }}
                to='/wallet'
            >
                <Heading align="center">{numberWithSpaces(user ? Number(user.balance) : 0)}</Heading>
                <Badge size="3" color="gold" variant="soft" radius="full">XP</Badge>

            </Link>
            <Select.Root onValueChange={(l) => handleChangeLanguage(l)} value={lang} size="2">
                <Select.Trigger variant="soft" color='bronze' radius="full" />
                <Select.Content color="gray">
                    <Select.Item value="en">EN</Select.Item>
                    <Select.Item value="ru">RU</Select.Item>
                </Select.Content>
            </Select.Root>

        </Flex>
    );
}