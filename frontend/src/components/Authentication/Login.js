import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import SocialLoginButtons from "./SocialLoginButtons";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    // Validate form inputs
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const payload = { email, password };

    try {
      // Attempt to log in
      const { data } = await axios.post("/api/user/login", payload, config);
      console.log("Login Response Data:", data);

      toast({
        title: "Login successful!",
        description: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (loginError) {
      console.error("Login Error:", loginError.response);
      const errMsg =
        loginError.response?.data?.message || "An error occurred during login.";

      // Check if the error indicates that the user does not exist
      if (
        errMsg.toLowerCase().includes("not found") ||
        errMsg.toLowerCase().includes("no user")
      ) {
        // If no account exists, attempt to register the user
        try {
          const { data } = await axios.post("/api/user", payload, config);
          console.log("Registration Response Data:", data);
          toast({
            title: "Account created!",
            description:
              "Your account has been created and you are now logged in.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          history.push("/chats");
        } catch (regError) {
          console.error("Registration Error:", regError.response);
          const regErrMsg =
            regError.response?.data?.message ||
            "An error occurred during registration.";
          toast({
            title: "Error occurred during registration!",
            description: regErrMsg,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      } else {
        toast({
          title: "Error occurred!",
          description: errMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345678");
        }}
      >
        Get Guest User Credentials
      </Button>

      <SocialLoginButtons />
    </VStack>
  );
}

export default Login;
