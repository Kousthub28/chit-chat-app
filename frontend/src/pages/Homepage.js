import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  return (
    <Container maxW="lg" centerContent mt={8}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="blue.500"
        color="white"
        p={4}
        w="full"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontFamily="Work sans"
          color="white"
        >
          Chit-Chat
        </Text>
      </Box>
      <Box bg="white" w="full" p={6} borderRadius="lg" color="black" mt={6}>
        <Tabs variant="enclosed">
          <TabList mb={4}>
            <Tab width="50%" _selected={{ color: "white", bg: "blue.600" }}>
              Login
            </Tab>
            <Tab width="50%" _selected={{ color: "white", bg: "green.500" }}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
