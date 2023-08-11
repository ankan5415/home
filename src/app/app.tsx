"use client";

import {
  Box,
  Card,
  CardBody,
  Center,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Emoji from "react-emojis";
import NextLink from "next/link";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineTwitter,
} from "react-icons/ai";
import BeavrLabsImage from "public/assets/beavr-labs.png";

export default function App() {
  return (
    <Center w="full" pt={{ base: "20px", sm: "80px" }}>
      <VStack maxW={"2xl"} w="80%">
        <HStack w="full" justifyContent={"space-between"}>
          <Text>
            Hi <Emoji emoji="waving-hand" />, my name is
          </Text>
          <Text>Toronto, Canada</Text>
        </HStack>
        <HStack w="full" justifyContent={"space-between"} alignItems={"end"}>
          <HStack spacing={1}>
            <Heading>
              <span style={{ fontWeight: 600 }}>Ankur</span>{" "}
              <span style={{ fontWeight: 400 }}>Boyed</span>
            </Heading>
          </HStack>
          <HStack fontSize={"30"}>
            <Emoji emoji="robot" />
            <Emoji emoji="desktop-computer" />
            <Emoji emoji="man-lifting-weights" />
            <Emoji emoji="helicopter" />
            <Emoji emoji="flag-canada" />
            <Emoji emoji="flag-india" />
          </HStack>
        </HStack>
        <Text>
          I&apos;m a coding cowboy <Emoji emoji="cowboy-hat-face" /> who loves
          building products. Currently taking a year off my studies
          @UWaterloo_SE to turn ideas into reality @Beavr_Labs, hack on startup
          ideas, and travel the world.
        </Text>
        <Text>
          You can find me in the park flying drones <Emoji emoji="helicopter" />
          , in the gym lifting weights <Emoji emoji="man-lifting-weights" />, or
          in the office @ midnight <Emoji emoji="crescent-moon" /> working on a
          business idea.
        </Text>
        <HStack w="full" justifyContent={"space-between"}>
          <HStack>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="telephone-receiver" /> Let&apos;s chat
            </Link>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="page-facing-up" /> Resume
            </Link>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="envelope" /> Email
            </Link>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="open-book" /> Content
            </Link>
          </HStack>
          <HStack>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <AiFillInstagram size={20} />
            </Link>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <AiOutlineTwitter size={20} />
            </Link>
            <Link
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <AiFillLinkedin size={20} />
            </Link>
          </HStack>
        </HStack>
        <VStack w="full">
          <Heading fontWeight={500} fontSize={"3xl"} alignSelf={"start"}>
            Experiences
          </Heading>
          <Card
            borderColor="#F5F5F5"
            borderWidth={"1px"}
            borderRadius={"lg"}
            boxShadow={"0px 0px 13px 0px rgba(0, 0, 0, 0.10)"}
            w="full"
            h="500px "
          >
            <CardBody>
              <Image src={BeavrLabsImage} />
            </CardBody>
          </Card>
        </VStack>
      </VStack>
    </Center>
  );
}
