import { Text } from "@chakra-ui/react";

interface textProps {
  text: String;
}

const ErrorLoading = ({ text }: textProps) => {
  return (
    <Text fontSize={"1.2rem"} fontWeight={"550"} ml={20} mt={5}>{text}</Text>
  );
};

export default ErrorLoading;
