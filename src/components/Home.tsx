import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Hide,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import PopupModal from "./PopupModal";
import { RiDeleteBin5Fill as DeleteIcon } from "react-icons/ri";

import { ModalType, Student } from "../utils/constants";
import { useEffect, useState } from "react";
import ImageName from "./ImageName";
import axios from "axios";
import ErrorLoading from "./ErrorLoading";

const BASE_URL = "https://yellowowlbackend-l2ap.onrender.com/api";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [loading , setLoading] = useState<boolean>(false);
  const [error , setError] = useState<boolean>(false);
  const [errorMessage , setErrorMessage] = useState<String>("");

  const [formData, setFormData] = useState<Student>({
    name: "",
    email: "",
    phone: "",
    enrollNo: "",
    dateOfAdmission: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios
      .get(`${BASE_URL}/search?s=${searchInput}`)
      .then(({ data }) => {
        console.log(data.students);
        setStudents(data.students);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [searchInput]);

  const handleSubmit = (type: ModalType) => {

    setLoading(true);
    setError(false);
    if (type === ModalType.Create) {
      axios
        .post(`${BASE_URL}/postStudent`, formData)
        .then((res) => {
          console.log("res--" , res)
          if(res.data?.error){
            setErrorMessage(res.data.messgae)
          }else {
            setStudents([...students, res.data.student]);
          }
          setFormData({
            name: "",
            email: "",
            phone: "",
            enrollNo: "",
            dateOfAdmission: "",
          });
          setError(false);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else {
       
      axios
        .patch(`${BASE_URL}/updateStudent/${formData._id}`, formData)
        .then((res) => {
          let updatedStudent = res.data.student;

          let updatedStudents = students.map((e) =>
            e._id === updatedStudent._id ? updatedStudent : e
          );
          setStudents(updatedStudents);
          setFormData({
            name: "",
            email: "",
            phone: "",
            enrollNo: "",
            dateOfAdmission: "",
          });
          setError(false);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  };

  const handleDelete = () => {
    setLoading(true);
    setError(false);
    axios
      .delete(`${BASE_URL}/deleteStudent/${studentId}`)
      .then((res) => {
        let deletedStudent = res.data.student;

        let updatedStudents = students.filter((e) => e._id !== deletedStudent);
        setStudents(updatedStudents);
        setError(false)
        setLoading(false)
      })
      .catch(() => {
       setError(true)
       setLoading(false)
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/getStudent`)
      .then(({ data }) => {
        setStudents(data.students);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
  return (
    <Box bg={"#E5E7EB"} height={"90vh"}>
      {loading &&  <ErrorLoading text = "Loading..."/>}
      {error && <ErrorLoading text = "Something went wrong"/>}
      {errorMessage && <ErrorLoading text = {errorMessage}/>} 
      <VStack h={"95vh"} p={5}>
        <HStack
          w={"100%"}
          py={2}
          borderRadius={"8px"}
          px={5}
          justify={"space-between"}
        >
          <Box>
            <Heading as="h2" size="lg">
              Students
            </Heading>
          </Box>
          <Flex maxW={"70%"} gap={"10px"}>
            <Input
              type="text"
              placeholder="Search..."
              bgColor={"white"}
              value={searchInput}
              onChange={handleSearchChange}
            />

            <PopupModal
              type={ModalType.Create}
              {...formData}
              changeState={handleChange}
              handleSubmit={handleSubmit}
              setFormData={setFormData}
            />
          </Flex>
        </HStack>
        <TableContainer
          w={"100%"}
          shadow={
            "rgba(50, 50, 93, 0.25) 0px 8px 15px 2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;"
          }
          borderRadius={"8px"}
        >
          <Table className = "table" variant="simple">
            <Thead bg={"#F9FAFB"} padding={"10px"} textAlign={"center"}>
              <Tr>
                <Th textAlign={"center"}>NAME</Th>
                <Th textAlign={"center"}>EMAIL</Th>
                <Hide below="md">
                  <Th textAlign={"center"}>PHONE</Th>
                </Hide>
                <Hide below="md">
                  <Th textAlign={"center"}>ENROLL NUMBER</Th>
                </Hide>
                <Hide below="md">
                  <Th textAlign={"center"}>DATE OF ADMISSION</Th>
                </Hide>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody bg={"#FFFFFF"} m={"10px"}>
              {students.length > 0 &&
                students.map((student) => (
                  <Tr
                    p={"10px"}
                    style={{
                      padding: "10px",
                    }}
                    key={student._id}
                  >
                    <Td textAlign={"left"}>
                      <ImageName name={student.name} />
                    </Td>
                    <Td textAlign={"center"}>{student.email}</Td>
                    <Hide below="md">
                      <Td textAlign={"center"}>{student.phone}</Td>
                    </Hide>
                    <Hide below="md">
                      <Td textAlign={"center"}>{student.enrollNo}</Td>
                    </Hide>
                    <Hide below="md">
                      <Td textAlign={"center"}>{student.dateOfAdmission}</Td>
                    </Hide>

                    <Td textAlign={"center"}>
                      <Flex justifyContent={"start"} gap={"10px"}>
                        <Box onClick={() => setFormData(student)}>
                          <PopupModal
                            type={ModalType.Update}
                            {...formData}
                            changeState={handleChange}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                          />
                        </Box>
                        <Box
                          onClick={() => {
                            setStudentId(String(student._id));
                            onOpen();
                          }}
                          _hover={{
                            background: "local",
                            border: "none",
                          }}
                          cursor={"pointer"}
                        >
                          <DeleteIcon color="red" />
                        </Box>
                      </Flex>
                      <DeleteModal
                        student={student}
                        handleDelete={handleDelete}
                        isOpen={isOpen}
                        onClose={onClose}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
};

interface deleteModalProps {
  student: Student;
  handleDelete: any;
  onClose: any;
  isOpen: any;
}

const DeleteModal = ({ handleDelete, onClose, isOpen }: deleteModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <Box padding={"210px"}>
        <ModalOverlay bg={"#1313132c"} />
        <ModalContent p={"2.5rem"}>
          <ModalBody fontWeight={600} fontSize={"18px"}>
            Are you sure to delete this Student ?
          </ModalBody>

          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            gap={"18px"}
            p={"15px 0"}
          >
            <Button
              colorScheme="green"
              bg={"#22C55E"}
              width={"65%"}
              onClick={() => {
                handleDelete();
                onClose();
              }}
            >
              Yes
            </Button>
            <Button
              colorScheme="red"
              bg={"#C55D22"}
              width={"65%"}
              onClick={onClose}
            >
              No
            </Button>
          </Flex>
        </ModalContent>
      </Box>
    </Modal>
  );
};

export default Home;
