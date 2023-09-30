import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";


export const useDeleteProduct =({onSuccess})=>{
  return useMutation({
    mutationFn: async (id) => {
      const deleteProduct = await axiosInstance.delete(`/products/${id}`);
      return deleteProduct;
    },
    onSuccess: onSuccess
  });
}