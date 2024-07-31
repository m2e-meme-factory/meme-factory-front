import * as React from "react";
import {
  Grid,
  Text,
  Card,
  DataList,
  Badge, Heading,
} from "@radix-ui/themes";
import { useTelegram } from "../../shared/hooks/useTelegram";
import CopyableCode from "../../shared/components/CopyableCode";
import CopyableTextField from "../../shared/components/CopyableTextField";
import { useGetRefData } from "../../shared/utils/api/hooks/useGetRefData";
import { useGetUserData } from "../../shared/utils/api/hooks/useGetUserData";

export default function ProfilePage() {
  const { user, webApp } = useTelegram();
  const tg = webApp;

  const userId = user?.id?.toString();

  const { data: userRes, isLoading: userLoading } = useGetUserData("", userId);
  const refId = userRes?.data?.user?.refId?.toString();
  const { data: refData, isLoading: refLoading } = useGetRefData("", refId);

  if (userLoading || refLoading) {
    return <div>Loading...</div>;
  }

  const userData = userRes?.data?.user;
  const refCount = refData?.data?.count || "0";
  const refUUID = userData?.ref_uuid || "";

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
                  <CopyableCode value={userId || ""} />
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
            <Text color="gray">Your Ref link:</Text>
            <CopyableTextField
                size={"2"}
                fieldSize="3"
                value={`https://t.me/m2e_meme_factory_bot?start=ref_${refUUID}`}
            />
            <DataList.Root mt="4">
              <DataList.Item align="center">
                <DataList.Item>
                  <DataList.Label minWidth="88px">Total Count</DataList.Label>
                  <DataList.Value>{refCount}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Total profit</DataList.Label>
                  <DataList.Value>0 M2E</DataList.Value>
                </DataList.Item>
              </DataList.Item>
            </DataList.Root>
          </Grid>
        </Card>
      </>
  );
}
