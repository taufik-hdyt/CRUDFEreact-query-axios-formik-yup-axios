import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useFetchProducts } from "@/features/products/useFetchProducts";
import { useFormik } from "formik";
import { useCreateProduct } from "@/features/products/useCreateProduct";
import { useDeleteProduct } from "@/features/products/useDeleteProduct";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useUpdateProduct } from "@/features/products/useEditProduct";

const inter = Inter({ subsets: ["latin"] });

// chakra ui => CSS framework
// formik => handle form
// yup => Validation
// axios => API Calls
// React Query => Manage API calls

export default function Home() {
  const toast = useToast();

  // FETCH / Get
  const {
    data: dataProducts,
    isLoading: loadingProducts,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: ()=>{
      toast({
        title: 'Terjadi kesalah pahaman',
        status: 'error'
      })
    }
  });

  //  =========================================


  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      id: 0
    },
    onSubmit: () => {
      // melakaukan post product
      const { name, price, description,id } = formik.values;

      // Condisi update
      if(id){
        updateProduct({
          name,
          price: parseInt(price),
          description,
          image: "Kosong",
          id
        })
      }else{
        createProduct({
          name,
          price: parseInt(price),
          description,
          image: "Kosong",
        });
      }
      formik.resetForm()
    },
  });

  // POST
  const { mutate: createProduct, isLoading: loadingAdd } = useCreateProduct({
    onSuccess: () => {
      toast({
        title: "Product di tambahkan",
        status: "success",
      });
      refetchProducts();
    },
  });

  //DELETE
  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess : () => {
      toast({
        title: "Berhasil di hapus",
        status: "success",
      });
      refetchProducts();
    },
  })

  // EDIT PATCH
  const onEditClick = (product)=>{
    formik.setFieldValue('id',product.id)
    formik.setFieldValue('name',product.name)
    formik.setFieldValue('price',product.price)
    formik.setFieldValue('description',product.description)
  }
  const {mutate: updateProduct, isLoading: loadingUpdate} = useUpdateProduct({
    onSuccess: ()=>{
      toast({
        title: "Berhasil di update",
        status: "success",
      });

      refetchProducts()
    }
  })

  const confirmationDelete = (id) => {
    const prompt = confirm("Yakin nihh");
    if (prompt) return deleteProduct(id);
    toast({
      title: "Yah di hapus",
      status: 'success'
    });
  };

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  return (
    <Box>
      <Heading textAlign='center'>CRUD</Heading>
      <Grid gridTemplateColumns='1fr 400px'  gap='8' px={6}>
      <Table mt={6} >
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Description</Th>
            <Th colSpan={2} textAlign='center'>action</Th>

          </Tr>
        </Thead>
        {loadingProducts && <Spinner mt={3} />}
        <Tbody>
          {dataProducts?.data?.map((e) => (
            <Tr key={e.id}>
              <Td>{e.id}</Td>
              <Td>{e.name}</Td>
              <Td>{e.price}</Td>
              <Td>{e.description}</Td>
              <Td>
                <Button colorScheme="cyan" onClick={() => onEditClick(e)}>Edit</Button>
              </Td>
              <Td>
                <Button onClick={() => confirmationDelete(e.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* ===== Create product using formik and reqct query */}
      <Box >

      <form onSubmit={formik.handleSubmit}>
        <Input visibility='hidden' name="id" value={formik.values.id} />
        <FormControl mt={4}>
          <FormLabel>Name</FormLabel>
          <Input
            onChange={handleFormInput}
            name="name"
            placeholder="Masukan name"
            value={formik.values.name}
          />
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            onChange={handleFormInput}
            name="price"
            placeholder="Masukan Price"
            value={formik.values.price}
          />
          <FormLabel>Description</FormLabel>
          <Input
            value={formik.values.description}
            onChange={handleFormInput}
            name="description"
            placeholder="Masukan Description"
          />
        </FormControl>

        <Button mt={3} type="submit">
          {loadingAdd ? <Spinner /> + "Loading..." : "Submit"}
        </Button>
      </form>
      </Box>
      </Grid>
    </Box>
  );
}
