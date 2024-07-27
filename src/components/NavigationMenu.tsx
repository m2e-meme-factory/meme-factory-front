import { Box, Button, Card, Flex, Separator } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../pages/router';



const NavigationMenu = () => {
  const location = useLocation();

  return (
    <Box style={{ position: "fixed", bottom: "0", width: "100%" }}>
      <Flex justify="center" m="4">
        <Card>
          <Flex gap="3" align="center">
            {routes.map((route, i) => 
            <>
                  <Link to={route.path}>
                  <Button size="3" variant={location.pathname == route.path ? "solid" : "outline"}>
                    {route.title}
                  </Button>
                </Link>
                {i != routes.length - 1 && 
                  <Separator size="2" orientation="vertical" />
                }
            </>
            )}
            {/* <Link to={"/tasks"}>
              <Button size="3" variant="outline">
                Tasks
              </Button>
            </Link>
            <Separator size="2" orientation="vertical" />

            <Link to={"/profile"}>
              <Button size="3">Profile</Button>
            </Link>
            <Separator size="2" orientation="vertical" />

            <Link to={"/about"}>
              <Button size="3" variant="outline">
                About
              </Button>
            </Link> */}
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};



export default NavigationMenu;