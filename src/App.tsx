import { Flex } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <Flex width={"100vw"}>
      <Sidebar></Sidebar>
      <Flex flexGrow={1} direction={"column"} width={[10]}>
        <Navbar />
        <Home></Home>
      </Flex>
    </Flex>
  );
}

export default App;
