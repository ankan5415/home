import type { Metadata } from "next";
import {
  Box,
  Button,
  Container,
  HStack,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Horizon Ventures",
  description: "Bootstrap your landing page pipeline with Horizon Ventures.",
};

export default function HorizonVenturesPage() {
  return (
    <Box bgGradient="linear(to-b, white, gray.50)" minH="100vh">
      <Container maxW="5xl" py={{ base: 20, md: 28 }}>
        <Stack spacing={{ base: 8, md: 12 }} textAlign="left">
          <Stack spacing={{ base: 2, md: 4 }}>
            <Heading
              as="h1"
              fontWeight="700"
              lineHeight={{ base: "shorter", md: "1.05" }}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              color="gray.900"
              maxW="4xl"
            >
              Horizon Ventures
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="3xl"
            >
              Horizon Ventures is a product studio focused on building and
              scaling generative AI products.
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              maxW="3xl"
            >
              Our first product is a fully agentic landing page optimizer called
              augmentic.
            </Text>
          </Stack>
          <HStack
            spacing={{ base: 3, md: 6 }}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Button
              size="lg"
              px={{ base: 6, md: 8 }}
              colorScheme="gray"
              bg="gray.900"
              color="white"
              _hover={{ bg: "gray.800" }}
              isDisabled
            >
              Augmentic (Coming Soon!)
            </Button>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
