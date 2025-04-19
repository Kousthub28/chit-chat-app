import { useEffect, useState } from "react";
import React from "react";
import {
  FormControl,
  Input,
  Box,
  Text,
  IconButton,
  Spinner,
  useToast,
  Flex,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogics";

const ENDPOINT = "http://localhost:5000"; // Change to production URL when deploying
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    // Ensure that for keydown events only the Enter key triggers the send
    if (event.type === "keydown" && event.key !== "Enter") return;

    if (
      (event.key === "Enter" || event.type === "click") &&
      newMessage.trim()
    ) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Save current message and clear input immediately
        const messageContent = newMessage;
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare || // If chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
      maxWidth="100%"
      overflow="hidden"
    >
      {selectedChat ? (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          borderRadius="lg"
          overflow="hidden"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            padding={3}
            bg="white"
            borderBottomWidth="1px"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
              aria-label="Go back"
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              flex={1}
              fontFamily="Work sans"
              textAlign="center"
              color="teal.500"
            >
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            bg="#E8E8E8"
            flex={1}
            overflowY="auto"
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* Modified: Removed onKeyDown from FormControl */}
            <FormControl id="message-input" isRequired marginTop={3}>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  width={60}
                  height={50}
                  style={{ marginBottom: 10, marginLeft: 0 }}
                  className="lottie-typing"
                />
              )}
              <Flex>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage} // Trigger send on Enter key
                  flex={1}
                />
                <Button
                  onClick={sendMessage}
                  sx={{ ml: 2, background: "green.200", color: "black" }}
                >
                  Send
                </Button>
              </Flex>
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          bg="#F8F8F8"
          padding={3}
        >
          <Text fontSize="3xl" fontFamily="Work sans" color="gray.600">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SingleChat;
