import { Flex, Heading, Image } from "@chakra-ui/react";

interface imageNameProps {
  name: String;
}

const ImageName = ({ name }: imageNameProps) => {
  return (
    <Flex gap={"10px"} justifyContent={"left"} alignItems={"center"} padding={"10px"}>
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://img.freepik.com/premium-photo/portrait-positive-caucasian-male_1016700-3236.jpg?w=1800"
        alt="Profile"
      />

      <Heading as="h5" size="sm">
        {name} 
      </Heading>
    </Flex>
  );
};

export default ImageName;
