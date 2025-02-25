import axios from "axios";
import { axiosInstance } from "./axiosInstance";

// Add a new product
export const AddProduct = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/products/add-product", payload);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Get all products
export const GetProduct = async (filters) => {
    try {
        const response = await axiosInstance.post("/api/products/get-products", filters);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Edit a product
export const EditProduct = async (id, payload) => {
  try {
      const response = await axiosInstance.put(`/api/products/edit/product/${id}`, payload);
      return response.data;
  } catch (error) {
      return { success: false, message: error.message };
  }
};

//get a product by id
export const GetProductById = async(id) =>{
    try{
        const response = await axiosInstance.get(
            `/api/products/get-product-by-id/${id}`
        );
        return response.data;
    } catch(error){
        return error.message;
    }
};


// Delete a product
export const DeleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//upload product image
export const UploadProductImage = async (payload) => {
    try {
      const response = await axiosInstance.post("/api/products/upload-product-image", payload);
      return response.data;
    } catch (error) {
        console.log(error);
      return { success: false, message: error.message };
    }
  };

  //update product status
  export const UpdateProductStatus = async(id, status)=>{
    try{
        const response = await axiosInstance.put(
            `/api/products/update-product-status/${id}`,
            { status }
        );
        return response.data;
    } catch(error){
        return error.message;
    }
  }

  //place a new bid
  export const PlaceNewBid = async(payload)=>{
    try{
        const response = await axiosInstance.post("/api/bids/place-new-bid", payload);
        return response.data;
    } catch(error){
        return error.message;
    }
  }

  //get all bids
  export const GetAllBids = async(filters)=>{
    try{
        const response = await axiosInstance.post(
            "/api/bids/get-all-bids", filters
        );
        return response.data;
    } catch(error){
        return error.message;
    }
  }