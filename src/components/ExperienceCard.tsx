import {
  AspectRatio,
  Box,
  Card,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import BeavrLabsImage from "public/assets/beavr-labs.png";
import NextImage, { StaticImageData } from "next/image";
import NextLink from "next/link";
import dayjs from "dayjs";
export default function ExperienceCard({
  children,
  isCurrent,
  imgSrc,
  startDate,
  endDate,
  imgAlt,
  title,
  upperTags,
  lowerTags,
  urlSrc,
}: {
  isCurrent?: boolean;
  children: React.ReactNode;
  imgSrc: string | StaticImageData;
  imgAlt: string;
  startDate: Date;
  endDate: Date;
  title: string;
  lowerTags: string;
  upperTags: string;
  urlSrc: string;
}) {
  const formattedStartDate = dayjs(startDate).format("MMM YYYY");
  const months = dayjs(endDate).diff(startDate, "month");
  return (
    <Card
      as={NextLink}
      href={urlSrc ?? "#"}
      transitionDuration={"0.3s"}
      _hover={{ backgroundColor: "#FBFBFB" }}
      borderColor="#F5F5F5"
      borderWidth={"1px"}
      borderRadius={"lg"}
      boxShadow={"0px 0px 13px 0px rgba(0, 0, 0, 0.10)"}
      w="full"
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          as={NextImage}
          src={imgSrc as string}
          borderTopRadius="lg"
          w="full"
          h="full" // Making it full height of its container
          alt={imgAlt}
        />
      </AspectRatio>

      <VStack w="full" p="8" spacing={4}>
        <Stack
          direction={["column-reverse", "column-reverse", "row"]}
          w="full"
          justifyContent={"space-between"}
        >
          <Heading fontSize={{ base: 18, sm: 24 }}>{title}</Heading>
          <Text>
            {formattedStartDate} | {isCurrent ? "Current" : `${months}mo`}
          </Text>
        </Stack>

        <Text fontSize={{ base: 14, sm: 16 }}>{children}</Text>

        <HStack w="full" justifyContent={"space-between"}>
          <Text>{lowerTags}</Text>
          <Text>See More →</Text>
        </HStack>
      </VStack>
    </Card>
  );
}
