import * as React from "react";
import {
  Theme,
  ThemePanel,
  Container,
  Section,
  Grid,
  Flex,
  TextField,
  Heading,
  IconButton,
  Button,
  Text,
  Tooltip,
  Spinner,
  Box,
  Card,
  Select,
  Blockquote,
  Switch,
  TextArea,
  Callout,
  Avatar,
  DataList,
  Code,
  Badge,
  Separator,
  Link as RadixLink,
  Skeleton,
} from "@radix-ui/themes";
import {
  StarIcon,
  ExclamationTriangleIcon,
  EyeClosedIcon,
  InfoCircledIcon,
  MagnifyingGlassIcon,
  Share2Icon,
  EnvelopeOpenIcon,
  PaperPlaneIcon,
  LockClosedIcon,
  CheckIcon,
  CrossCircledIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useTelegram } from "../../shared/hooks/useTelegram";
import { getRefData, getUserData, verifyUser } from "../../shared/utils/api/api";
import * as z from "zod";
import NavigationMenuDemo from "../../shared/components/NavigationMenu";
import { Link } from "react-router-dom";
import CopyableCode from "../../shared/components/CopyableCode";
import CopyableTextField from "../../shared/components/CopyableTextField";

export const transformPhoneNumber = (phoneNumber: string) => {
  let phoneRegex =
    /^\+?(\d{1,3})?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
  let match = phoneNumber.match(phoneRegex);

  if (match) {
    // Приведение номера к единому формату: +XXXXXXXXXXX
    let standardizedPhoneNumber = `${match[1]}${match[2]}${match[3]}${match[4]}${match[5]}`;

    return standardizedPhoneNumber;
  } else {
    return null;
  }
};

const formDataSchema = z.object({
  name: z.string().min(2, { message: "Имя не может быть пустым" }),
  phone: z
    .string()
    .min(1, { message: "Номер телефона не может быть пустым" })
    .regex(
      /^\+?\d{1,3}?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/,
      {
        message: "Неверный формат номера телефона",
      }
    ),
  email: z
    .string()
    .min(1, { message: "Email не может быть пустым" })
    .email({ message: "Неверный формат email" }),
});

export default function ProfilePage() {

  
  const { user, webApp } = useTelegram();
  const tg = webApp;

  const [userData, setUserData] = useState<{
    refData:{
      count: string
    },
    user: {
      refId: string,
      ref_uuid: string
    }
  }>()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRefInfo = async (user_id: string) =>{
      const userRes = await getUserData("", user_id)
      const data = await getRefData("", userRes.data.data.user.ref_uuid)
      
      setUserData({
        refData: {
          count: data.data.data.count
        },
        user: userRes.data.data.user
      })

      setIsLoading(false)
    }
    

    if (user?.id != undefined){
      fetchRefInfo(user.id.toString())
    }

  }, [user])


  return (
    <>
      <Card m="4">
        <Grid gap="4">
          <Heading>Profile</Heading>
          <DataList.Root>
            <DataList.Item align="center">
              <DataList.Label minWidth="88px">Status</DataList.Label>
              <DataList.Value>
                <Badge color="jade" variant="soft" radius="full">
                  Authorized
                </Badge>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">ID</DataList.Label>
              <DataList.Value>
                <CopyableCode value={user?.id.toString() || ""} />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Name</DataList.Label>
              <DataList.Value>{`${user?.last_name} ${user?.first_name}`}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label minWidth="88px">Nickname</DataList.Label>
              <DataList.Value>
                <CopyableCode value={`${user?.username}`} />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Type</DataList.Label>
              <DataList.Value>Creator</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Grid>
      </Card>

      <Card m="4">
        <Grid gap="4">
          <Heading>Referas</Heading>
          <Text color="gray" onClick={() => console.log(userData)}>Your Ref link:</Text>
          {/* <Card variant="surface"> */}
            <CopyableTextField
              size={"2"}
              fieldSize="3"
              value={`https://t.me/m2e_meme_factory_bot?start=ref_${userData?.user.ref_uuid}`}
              // <TextArea>{`https://t.me/bot?ref=${"asd12-asd235-asd52"}`}</TextArea>}
            />

          <DataList.Root mt="4">
            <DataList.Item align="center">
              <DataList.Item>
                <DataList.Label minWidth="88px">Total Count</DataList.Label>
                <DataList.Value>{userData?.refData.count || "0"}</DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label minWidth="88px">Total profit</DataList.Label>
                <DataList.Value>0 M2E</DataList.Value>
              </DataList.Item>
            </DataList.Item>
          </DataList.Root>
          {/* </Card> */}
        </Grid>
      </Card>
    </>
  );
}
