import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Modal, Box, Typography, TextField, Checkbox, FormControlLabel, Button, Tabs, Tab, IconButton, MenuItem, Select, FormControl, InputLabel, Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SetLoader } from "../../../redux/loadersSlice";
import { AddProduct, EditProduct } from '../../../apicalls/products';
import Images from './images';

function ProductForm({ showProductForm, setShowProductForm, selectedProduct, onProductAdded, fetchProducts }) {
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [itemType, setItemType] = useState('');
  const [billAvailable, setBillAvailable] = useState(false);
  const [warrantyAvailable, setWarrantyAvailable] = useState(false);
  const [boxAvailable, setBoxAvailable] = useState(false);
  const [showBids, setShowBids] = useState(false);
  const [errors, setErrors] = useState({});
  const [productAddedSuccess, setProductAddedSuccess] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price);
      setAge(selectedProduct.age);
      setCategory(selectedProduct.category);
      setMaterial(selectedProduct.material);
      setColor(selectedProduct.color);
      setItemType(selectedProduct.itemType);
      setBillAvailable(selectedProduct.billAvailable);
      setWarrantyAvailable(selectedProduct.warrantyAvailable);
      setShowBids(selectedProduct.showBids);
      setBoxAvailable(selectedProduct.boxAvailable);
    } else {
      // Reset form state if there's no selected product (adding new product)
      setName('');
      setDescription('');
      setPrice('');
      setAge('');
      setCategory('');
      setMaterial('');
      setColor('');
      setItemType('');
      setBillAvailable(false);
      setWarrantyAvailable(false);
      setBoxAvailable(false);
      setShowBids(false);
    }
  }, [selectedProduct]);

  const handleCloseSuccessPopup = () => {
    setProductAddedSuccess(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleShowBidsChange = (event) => {
    setShowBids(event.target.checked);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = "Name is required";
    if (!description) formErrors.description = "Description is required";
    if (!price) formErrors.price = "Price is required";
    if (!age) formErrors.age = "Age is required";
    if (!category) formErrors.category = "Category is required";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      dispatch(SetLoader(true));
      try {
        const formData = {
          name,
          description,
          price,
          age,
          category,
          material,
          color,
          itemType,
          billAvailable,
          warrantyAvailable,
          boxAvailable,
          showBids,
          seller: user._id,
          status: 'pending'
        };

        let response;
        if (selectedProduct) {
          // Update existing product
          response = await EditProduct(selectedProduct._id, formData);
        } else {
          // Add new product
          response = await AddProduct(formData);
        }

        if (response.success) {
          setProductAddedSuccess(true);
          setShowProductForm(false);
          onProductAdded(); // Call the function passed from parent
        } else {
          setErrors({ submit: response.message });
        }
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        dispatch(SetLoader(false));
      }
    }
  };

  const getMaterialOptions = () => {
    switch (category) {
      case 'Men':
      case 'Women':
      case 'Kids':
        return ['Cotton', 'Polyester', 'Linen', 'Silk', 'Other'];
      case 'Accessories':
        return ['Gold', 'Silver', 'Plastic', 'Leather', 'Other'];
      case 'Footwear':
        return ['Leather', 'Synthetic', 'Rubber', 'Foam', 'Plastic', 'Other'];
      default:
        return [];
    }
  };

  const getItemTypeOptions = () => {
    switch (category) {
      case 'Men':
        return ['Shirts', 'T-Shirts', 'Pants', 'Jeans', 'Shorts', 'Other'];
      case 'Women':
        return ['Tops', 'Crop Tops', 'T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Dress', 'Other'];
      case 'Kids':
        return ['T-Shirts', 'Pants', 'Shirts', 'Dress', 'Other'];
      case 'Accessories':
        return ['Ring', 'Earring', 'Necklace', 'Bracelet', 'Glasses', 'Belts', 'Bags', 'Other'];
      case 'Footwear':
        return ['Shoes', 'Flats', 'Slip Ons', 'Heels', 'Other'];
      default:
        return [];
    }
  };

  const colorOptions = ['Neutrals', 'Brights', 'Black', 'White', 'Other'];

  return (
    <Modal
      open={showProductForm}
      onClose={() => setShowProductForm(false)}
      aria-labelledby="product-form-title"
      aria-describedby="product-form-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxWidth: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #f8bbd0 30%, #ec407a 90%)',
          color: 'white',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            {selectedProduct ? "Edit Product" : "Add Product"}
          </Typography>
          <IconButton onClick={() => setShowProductForm(false)} style={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
        >
          <Tab label="General" />
          <Tab label="Images" disabled={!selectedProduct} />
        </Tabs>

        {tabIndex === 0 && (
          <Box mt={2}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { backgroundColor: 'white', height: '60px' } }}
            />
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Description"
              margin="normal"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { backgroundColor: 'white', height: '70px' } }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <TextField
                required
                variant="outlined"
                label="Price"
                margin="normal"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                InputLabelProps={{ style: { color: 'black' } }}
                InputProps={{ style: { backgroundColor: 'white', height: '60px' } }}
                sx={{ flex: 1, mr: 1 }}
              />
              <TextField
                required
                variant="outlined"
                label="Age"
                margin="normal"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={!!errors.age}
                helperText={errors.age}
                InputLabelProps={{ style: { color: 'black' } }}
                InputProps={{ style: { backgroundColor: 'white', height: '60px' } }}
                sx={{ flex: 1, mr: 1 }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControl
                variant="outlined"
                sx={{ flex: 1, mt: 1, mr: 1 }}
                error={!!errors.category}
              >
                <InputLabel sx={{ color: 'black' }}>Category</InputLabel>
                <Select
                  required
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="Men">Men</MenuItem>
                  <MenuItem value="Women">Women</MenuItem>
                  <MenuItem value="Kids">Kids</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                  <MenuItem value="Footwear">Footwear</MenuItem>
                </Select>
                {errors.category && <Typography variant="body2" color="error">{errors.category}</Typography>}
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{ flex: 1, mt: 1, mr: 1 }}
                error={!!errors.material}
              >
                <InputLabel sx={{ color: 'black' }}>Material</InputLabel>
                <Select
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  label="Material"
                  sx={{ backgroundColor: 'white' }}
                >
                  {getMaterialOptions().map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.material && <Typography variant="body2" color="error">{errors.material}</Typography>}
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{ flex: 1, mt: 1, mr: 1 }}
                error={!!errors.color}
              >
                <InputLabel sx={{ color: 'black' }}>Color</InputLabel>
                <Select
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  label="Color"
                  sx={{ backgroundColor: 'white' }}
                >
                  {colorOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.color && <Typography variant="body2" color="error">{errors.color}</Typography>}
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{ flex: 1, mt: 1 }}
                error={!!errors.itemType}
              >
                <InputLabel sx={{ color: 'black' }}>Item Type</InputLabel>
                <Select
                  required
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  label="Item Type"
                  sx={{ backgroundColor: 'white' }}
                >
                  {getItemTypeOptions().map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.itemType && <Typography variant="body2" color="error">{errors.itemType}</Typography>}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={billAvailable}
                    onChange={(e) => setBillAvailable(e.target.checked)}
                  />
                }
                label="Bill Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={warrantyAvailable}
                    onChange={(e) => setWarrantyAvailable(e.target.checked)}
                  />
                }
                label="Warranty Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={boxAvailable}
                    onChange={(e) => setBoxAvailable(e.target.checked)}
                  />
                }
                label="Box Available"
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showBids}
                    onChange={handleShowBidsChange}
                  />
                }
                label="Show Bids on Product Page"
                labelPlacement="end"
              />
              <Box display="flex">
                <Button
                  onClick={() => setShowProductForm(false)}
                  variant="contained"
                  style={{
                    marginRight: 8,
                    backgroundColor: 'white',
                    color: '#ec407a',
                    borderColor: '#ec407a'
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                  {selectedProduct ? "Update" : "Add"}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box mt={2}>
            <Typography variant="body1" component="p">
              <Images selectedProduct={selectedProduct} fetchProducts={fetchProducts} setShowProductForm={setShowProductForm} />
            </Typography>
          </Box>
        )}

        {errors.submit && <Typography color="error">{errors.submit}</Typography>}
        <Snackbar
          open={productAddedSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccessPopup}
          message={selectedProduct ? "Product updated successfully!" : "Product added successfully!"}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSuccessPopup}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Modal>
  );
}

export default ProductForm;
