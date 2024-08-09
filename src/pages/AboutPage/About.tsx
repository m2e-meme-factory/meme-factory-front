import { Badge, Card, DataList, Grid, Heading } from '@radix-ui/themes';
import * as React from 'react';
import packageJson from '../../../package.json';

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
        </Grid>
      </Card>
    </>
  );
}
