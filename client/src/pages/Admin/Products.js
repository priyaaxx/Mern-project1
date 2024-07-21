import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import moment from 'moment';
import { GetProduct, UpdateProductStatus } from '../../apicalls/products';
import { SetLoader } from '../../redux/loadersSlice';

function Products() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        dispatch(SetLoader(true));
        try {
            const response = await GetProduct(null);
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    const onStatusUpdate = async (id, newStatus) => {
        dispatch(SetLoader(true));
        try {
            const response = await UpdateProductStatus(id, newStatus);
            if (response.success) {
                fetchProducts(); // Refresh products after updating status
            } else {
                console.error("Failed to update status:", response.message);
            }
        } catch (error) {
            console.error("Error updating status:", error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Seller</TableCell>
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
                                            style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }} 
                                        />
                                    )}
                                    {product.name}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.seller.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.age}</TableCell>
                                <TableCell>{product.status.toUpperCase()}</TableCell>
                                <TableCell>{moment(product.createdAt).format("DD-MM-YYYY hh:mm A")}</TableCell>
                                <TableCell>
                                    <div className="flex gap-3">
                                        {product.status.toLowerCase() === "pending" && (
                                            <>
                                                <span
                                                    className="underline cursor-pointer"
                                                    onClick={() => onStatusUpdate(product._id, "approved")}
                                                >
                                                    Approve
                                                </span>
                                                <span
                                                    className="underline cursor-pointer"
                                                    onClick={() => onStatusUpdate(product._id, "rejected")}
                                                >
                                                    Reject
                                                </span>
                                            </>
                                        )}
                                        {product.status.toLowerCase() === "approved" && (
                                            <span
                                                className="underline cursor-pointer"
                                                onClick={() => onStatusUpdate(product._id, "blocked")}
                                            >
                                                Block
                                            </span>
                                        )}
                                        {product.status.toLowerCase() === "blocked" && (
                                            <span
                                                className="underline cursor-pointer"
                                                onClick={() => onStatusUpdate(product._id, "approved")}
                                            >
                                                Unblock
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Products;
