import React from "react";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { Button, ButtonGroup } from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { firebaseAuth } from "../../config/FirebaseConfig";
import { useHistory } from "react-router-dom";

export default function SocialLoginButtons() {
  const history = useHistory();

  const providers = {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider(),
    yahoo: new OAuthProvider("yahoo.com"),
  };

  const firebaseLogin = async (loginType) => {
    try {
      const provider = providers[loginType];
      const userData = await signInWithPopup(firebaseAuth, provider);
      console.log(userData);
      // At this point the user has chosen an account.
      // The provider's popup should let them pick one if multiple exist.
      // After successful login, redirect to the home page.
      history.push("/chats");
    } catch (err) {
      console.error("Authentication error: ", err.message);
    }
  };

  return (
    <ButtonGroup spacing={4} width="100%" style={{ marginTop: 15 }}>
      <Button
        variant="solid"
        colorScheme="blue"
        leftIcon={<BsGoogle />}
        onClick={() => firebaseLogin("google")}
      >
        Google
      </Button>
      <Button
        variant="solid"
        colorScheme="blue"
        leftIcon={<BsGithub />}
        onClick={() => firebaseLogin("github")}
      >
        Github
      </Button>
      <Button
        variant="solid"
        colorScheme="blue"
        // You can replace the text with a proper Yahoo icon if you have one.
        leftIcon={<span style={{ fontWeight: "bold" }}>Y</span>}
        onClick={() => firebaseLogin("yahoo")}
      >
        Yahoo
      </Button>
    </ButtonGroup>
  );
}
