"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import Emoji from "react-emojis";
import NextLink from "next/link";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineTwitter,
} from "react-icons/ai";
import BeavrLabsImage from "public/assets/beavr-labs.png";
import SeekoImage from "public/assets/seeko.png";
import MakerstopImage from "public/assets/makerstop.png";
import ExperienceCard from "@/components/ExperienceCard";
import { useMediaQuery } from "@chakra-ui/react";

export default function App() {
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)", {
    ssr: true,
    fallback: true, // return false on the server, and re-evaluate on the client side
  });
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)", {
    ssr: true,
    fallback: true, // return false on the server, and re-evaluate on the client side
  });

  return (
    <Center w="full" pt={{ base: "20px", sm: "80px" }}>
      <VStack maxW={"2xl"} w="80%" spacing={6}>
        <Stack w="full" justifyContent={"space-between"} direction={"row"}>
          <Text>
            Hi <Emoji emoji="waving-hand" />, my name is
          </Text>
          <Text hidden={!isLargerThan600}>Toronto, Canada</Text>
        </Stack>
        <HStack w="full" justifyContent={"space-between"} alignItems={"end"}>
          <HStack spacing={1}>
            <Heading>
              <span style={{ fontWeight: 600 }}>Ankur</span>{" "}
              <span style={{ fontWeight: 400 }}>Boyed</span>
            </Heading>
          </HStack>
          <HStack hidden={!isLargerThan600} fontSize={{ base: 20, md: 30 }}>
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
        <Stack
          w="full"
          justifyContent={"space-between"}
          direction={isLargerThan600 ? "row" : "column"}
        >
          <Flex
            w="full"
            columnGap={4}
            rowGap={2}
            flexWrap="wrap"
            overflowX="hidden"
          >
            <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="telephone-receiver" /> Let&apos;s chat
            </Link>
            <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="page-facing-up" /> Resume
            </Link>
            <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="envelope" /> Email
            </Link>
            <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://chakra-ui.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="open-book" /> Content
            </Link>
          </Flex>
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
        </Stack>
        <VStack w="full" mb="10" spacing={8}>
          <Heading fontWeight={500} fontSize={"3xl"} alignSelf={"start"}>
            Experiences
          </Heading>
          <ExperienceCard
            startDate={new Date(2022, 4, 1)}
            isCurrent
            endDate={new Date()}
            imgSrc={BeavrLabsImage}
            imgAlt="Beavr Labs Image"
            title="Co-founder @ Beavr Labs"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://beavrlabs.com"
          >
            Built a crypto exchange from scratch @1Bitcoin(dot)ca, an AI mentor
            @MentorGPT and an automated screening tool.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2021, 4, 1)}
            endDate={new Date(2022, 3, 1)}
            imgSrc={SeekoImage}
            imgAlt="Seeko App Image"
            title="CTO @ Seeko"
            upperTags="Here | There"
            lowerTags="(Defunct)"
            urlSrc="https://beavrlabs.com"
          >
            Built a grammarly-like chrome extension to expose monetization
            opportunities to content creators. Managed a team of 4 to build an
            MVP.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2020, 8, 1)}
            endDate={new Date(2021, 3, 1)}
            imgSrc={MakerstopImage}
            imgAlt="Makerstop Image"
            title="Founder @ Makerstop"
            upperTags="Here | There"
            lowerTags="(Defunct)"
            urlSrc="https://beavrlabs.com"
          >
            Built a SaaS app that allows 3D printing companies to provide
            automated quotes to their customers.
          </ExperienceCard>
          <Button
            variant={"outline"}
            _hover={{ backgroundColor: "#FBFBFB" }}
            w="full"
          >
            More Projects
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
