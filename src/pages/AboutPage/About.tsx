import { Badge, Button, Card, DataList, Grid, Heading, Text } from '@radix-ui/themes';
import * as React from 'react';
import packageJson from '../../../package.json';
import CopyableTextField from '../../shared/components/CopyableTextField';

export default function About() {
  return (
    <>
      <Card m='4'>
        <Grid gap='4'>
          <Heading>About Page</Heading>
          <DataList.Root>
            <DataList.Item align='center'>
              <DataList.Label minWidth='88px'>App version:</DataList.Label>
              <DataList.Value>
                <Badge color='jade' variant='soft' radius='full'>
                  {packageJson.version}
                </Badge>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
          <Text color='gray' size='2'>
            Access token:
          </Text>
          <CopyableTextField size={'2'} fieldSize='3' value={localStorage.getItem('token') ?? ''} />
          <Button
            onClick={() => {
              localStorage.setItem('onboardCompleted', 'false');
            }}
          >
            Tutoral again
          </Button>
        </Grid>
      </Card>
    </>
  );
}
