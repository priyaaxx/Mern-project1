import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Snackbar, Alert, Grid, IconButton } from "@mui/material";
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { UploadProductImage, EditProduct } from "../../../apicalls/products";

function Images({ selectedProduct, setShowProductForm, fetchProducts }) {
  const [images, setImages] = useState(selectedProduct.images || []);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(SetLoader(true));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        setImages((prevImages) => [...prevImages, response.data]);
        setFile(null);
        setImagePreview(null);
        setSnackbar({ open: true, message: response.message, severity: "success" });
        setImages([...images, response.data]);
        fetchProducts();
      } else {
        setSnackbar({ open: true, message: response.message, severity: "error" });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.log(error);
      setSnackbar({ open: true, message: "Failed to upload image. Please try again.", severity: "error" });
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedImagesArray = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImagesArray };
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      if (response.success) {
        setImages(updatedImagesArray);
        setSnackbar({ open: true, message: response.message, severity: "success" });
        fetchProducts();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete image. Please try again.", severity: "error" });
    }
  };

  useEffect(() => {
    setImages(selectedProduct.images || []);
  }, [selectedProduct.images]);

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" className="mb-4">
        {images.map((image, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <img src={image} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
                size="small"
                onClick={() => deleteImage(image)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <div className="flex justify-center mb-4">
        <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              setImagePreview(URL.createObjectURL(selectedFile));
            }}
          />
        </Button>
      </div>

      {file && (
        <Box className="flex justify-center mb-4">
          <Typography variant="body1">{file.name}</Typography>
        </Box>
      )}

      {imagePreview && (
        <Box className="flex justify-center mb-4">
          <Box
            sx={{
              width: 100,
              height: 100,
              border: "1px solid #ccc",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <img src={imagePreview} alt="Uploaded Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        </Box>
      )}

      <div className="flex justify-end gap-5">
        <Button
          style={{ color: "#ec407a", backgroundColor: "white" }}
          variant="contained"
          onClick={() => setShowProductForm(false)}
        >
          Cancel
        </Button>
        <Button variant="contained" disabled={!file} color="primary" onClick={upload}>
          Upload
        </Button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Images;
