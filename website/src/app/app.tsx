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
import MentorGPTImage from "public/assets/mentorgpt.png";
import MakerstopImage from "public/assets/makerstop.png";
import DestinationImaginationImage from "public/assets/destination-imagination.png";
import CWSFImage from "public/assets/cwsf.png";
import FLLImage from "public/assets/fll.png";
import BoardyImage from "public/assets/boardyai.png";
import AugmenticImage from "public/assets/augmentic.png";
import ExperienceCard from "@/components/ExperienceCard";
import { useMediaQuery } from "@chakra-ui/react";

export default function App() {
  return (
    <Center w="full" pt={{ base: "20px", sm: "80px" }}>
      <VStack maxW={"2xl"} w="80%" spacing={6}>
        {/* <h1 id="hero-title">Grow fast</h1> */}
        <Stack w="full" justifyContent={"space-between"} direction={"row"}>
          <Text>
            Hi <Emoji emoji="waving-hand" />, my name is
          </Text>
          <Text display={["none", "block"]}>Toronto, Canada</Text>
        </Stack>
        <HStack w="full" justifyContent={"space-between"} alignItems={"end"}>
          <HStack spacing={1}>
            <Heading>
              <span style={{ fontWeight: 600 }}>Ankur</span>{" "}
              <span style={{ fontWeight: 400 }}>Boyed</span>
            </Heading>
          </HStack>
          <HStack
            display={["none", "block"]}
            fontSize={{ base: 24, md: 30 }}
            letterSpacing={6}
          >
            <Emoji emoji="robot" />
            <Emoji emoji="desktop-computer" />
            <Emoji emoji="man-lifting-weights" />
            <Emoji emoji="helicopter" />
            <Emoji emoji="flag-canada" />
            <Emoji emoji="flag-india" />
          </HStack>
        </HStack>
        <Text>
          I&apos;m a 20-year-old entrepreneur and software developer. I love
          building products and businesses that solve real-world problems.
        </Text>
        <Stack
          w="full"
          justifyContent={"space-between"}
          direction={["column", "column", "row"]}
        >
          <Flex
            w="full"
            columnGap={4}
            rowGap={2}
            flexWrap="wrap"
            overflowX="hidden"
          >
            {/* <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://to.ankurboyed.com/cal"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="telephone-receiver" /> Let&apos;s chat
            </Link> */}
            {/* <Link
              whiteSpace="nowrap"
              as={NextLink}
              href={`/assets/resume.pdf`}
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="page-facing-up" /> Resume
            </Link> */}
            <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="mailto:ankur.boyed@gmail.com"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="envelope" /> Email
            </Link>
            {/* <Link
              whiteSpace="nowrap"
              as={NextLink}
              href="https://to.ankurboyed.com/portfolio"
              isExternal
              textUnderlineOffset={3}
            >
              <Emoji emoji="open-book" /> Content
            </Link> */}
          </Flex>
          <HStack>
            <Link
              as={NextLink}
              href="https://to.ankurboyed.com/instagram"
              isExternal
              textUnderlineOffset={3}
            >
              <AiFillInstagram size={20} />
            </Link>
            <Link
              as={NextLink}
              href="https://to.ankurboyed.com/x"
              isExternal
              textUnderlineOffset={3}
            >
              <AiOutlineTwitter size={20} />
            </Link>
            <Link
              as={NextLink}
              href="https://to.ankurboyed.com/linkedin"
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
            startDate={new Date(2025, 11, 1)}
            isCurrent
            endDate={new Date()}
            imgSrc={AugmenticImage}
            imgAlt="Augmentic Image"
            title="Founder @ Augmentic"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://augmentic.app/"
          >
            Building a fully agentic landing page optimizer.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2024, 6, 13)}
            endDate={new Date(2025, 9, 1)}
            imgSrc={BoardyImage}
            imgAlt="Boardy.ai Image"
            title="Co-Founder @ Boardy.ai"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://boardy.ai/"
          >
            Built an AI superconnector. Raised $11M in funding. Grew team to 15
            people and scaled to 80,000+ users.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2022, 4, 1)}
            endDate={new Date(2024, 6, 1)}
            imgSrc={BeavrLabsImage}
            imgAlt="Beavr Labs Image"
            title="Founder @ Beavr Labs"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://to.ankurboyed.com/bvr"
          >
            Successfully built products for 15 startups, scaling the team to 8
            people. Successfully launched a profitable design wing (Beavr
            Design).
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2024, 4, 1)}
            endDate={new Date(2024, 5, 15)}
            imgSrc={MentorGPTImage}
            imgAlt="MentorGPT Image"
            title="Founder @ MentorGPT"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://mentorgpt.co"
          >
            Built an AI that learns from educational content creators to give
            personalized advice to people. Acquired 800 users in the first week
            of launch. Failed because we didn&apos;t know how to monetize.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2021, 4, 1)}
            endDate={new Date(2022, 3, 1)}
            imgSrc={SeekoImage}
            imgAlt="Seeko App Image"
            title="Founder @ Seeko"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://to.ankurboyed.com/seeko"
          >
            Built a grammarly-like chrome extension to expose monetization
            opportunities to content creators. Managed a team of 4 to build an
            MVP. Onboarded dozens of content creators with a combined reach of
            250k+ viewers. Failed due to lack of product-market fit.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2020, 4, 1)}
            endDate={new Date(2021, 3, 1)}
            imgSrc={MakerstopImage}
            imgAlt="Makerstop Image"
            title="Founder @ Makerstop"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://to.ankurboyed.com/makerstop"
          >
            Started off as a 3D printing business, generating $2k in revenue.
            Pivoted into building a SaaS app that allows 3D printing companies
            to provide automated quotes to their customers. Failed because we
            weren&apos;t the right people to build it.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2018, 9, 1)}
            endDate={new Date(2019, 6, 1)}
            imgSrc={DestinationImaginationImage}
            imgAlt="Destination Imagination Image"
            title="4th place international prize @ Destination Imagination"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://ankurboyed.notion.site/Global-Drone-Competition-42be7f6c570841fcbe4bf62c2152cae1"
          >
            Won 4th place out of 35000 competitors in the Destination
            Imagination global finals competition. Built a drone capable of
            dropping payloads.
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2018, 9, 1)}
            endDate={new Date(2019, 5, 1)}
            imgSrc={FLLImage}
            imgAlt="FLL Image"
            title="International Finalist @ First Lego League"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://ankurboyed.notion.site/Bacteria-Management-in-Outer-Space-cc04b0116e8e478a9c859b4c72c21b1a"
          >
            Best Robot Design Award at the International West Virginia
            Invitational
          </ExperienceCard>
          <ExperienceCard
            startDate={new Date(2017, 9, 1)}
            endDate={new Date(2018, 5, 1)}
            imgSrc={CWSFImage}
            imgAlt="Science Fair Image"
            title="Silver @ Canada Wide Science Fair"
            upperTags="Here | There"
            lowerTags=""
            urlSrc="https://web.archive.org/web/20220625173623/https://secure.youthscience.ca/virtualcwsf/projectdetails.php?id=5885&"
          >
            Won silver at CWSF for measuring the impact of dimples on golf balls
            on their aerodynamic efficiency.
          </ExperienceCard>

          <Button
            as={NextLink}
            href={"https://to.ankurboyed.com/portfolio"}
            variant={"outline"}
            _hover={{ backgroundColor: "#FBFBFB" }}
            w="full"
            onClick={() => {
              window?.augmentic.track("initiate_checkout", { name: "Elon", email: "elon@x.com" });
            }}
          >
            All Projects
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
