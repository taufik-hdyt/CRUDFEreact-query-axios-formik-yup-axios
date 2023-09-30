import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useFetchProducts = () => {
  // ================ Versi Biasa =====================
  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsloading] = useState(false);
  // const fetchProducts = async () => {
  //   setIsloading(true); // sedang loading data
  //   try {
  //     setTimeout(async () => {
  //       const dataProducts = await axiosInstance.get("/products");
  //       // console.log(dataProducts.data);
  //       setProducts(dataProducts.data);
  //       setIsloading(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  //================== Versi React Query ========================
  const { data: products, isLoading,refetch } = useQuery({
    queryFn: async () => {
      const dataProducts = await axiosInstance.get("/products");
      return dataProducts;
    },
    // refetchOnWindowFocus: false, // penggilan api setiap ganti windows atau focus windows dia akan melakukan get Api, secara default itu true
    queryKey: ['fetch.products']
  });

  return {
    data: products,
    isLoading,
    refetch
  };
};
