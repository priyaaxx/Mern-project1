import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import { GetProduct, DeleteProduct } from '../../../apicalls/products';
import { SetLoader } from '../../../redux/loadersSlice';
import ProductForm from './ProductForm';
import Bids from './Bids';
import { MoveDown } from '@mui/icons-material';

function Products() {
    const { user } = useSelector(state => state.users);
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showBids, setShowBids] = useState(false);

    const fetchProducts = async () => {
        dispatch(SetLoader(true));
        try {
            const response = await GetProduct({
                seller: user._id,
            });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    const handleDelete = async (id) => {
        dispatch(SetLoader(true));
        try {
            const response = await DeleteProduct(id);
            if (response.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowProductForm(true);
    };

    const handleProductAdded = () => {
        fetchProducts();
        setShowProductForm(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <div className='flex justify-end'>
                <Button variant='contained' color='primary' onClick={() => {
                    setSelectedProduct(null);
                    setShowProductForm(true);
                }}>
                    Add Product
                </Button>
            </div>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Added On</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    {product.images.length > 0 && (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 5 }} 
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.age}</TableCell>
                                <TableCell>{product.status.toUpperCase()}</TableCell>
                                <TableCell>{moment(product.createdAt).format("DD-MM-YYYY hh:mm A")}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEdit(product)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Button variant="outlined" color="primary" onClick={() => {
                                        setSelectedProduct(product);
                                        setShowBids(true);
                                    }}>
                                        Show Bids
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {showProductForm && (
                <ProductForm
                    showProductForm={showProductForm}
                    setShowProductForm={setShowProductForm}
                    selectedProduct={selectedProduct}
                    fetchProducts={fetchProducts}
                    onProductAdded={handleProductAdded}
                />
            )}

            {showBids && (
                <Bids
                    showBidsModal={showBids}
                    setShowBidsModal={setShowBids}
                    selectedProduct={selectedProduct}
                />
            )}
        </div>
    );
}

export default Products;
