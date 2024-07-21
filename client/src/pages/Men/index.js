import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Paper,
  IconButton,
  Badge,
  TextField,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice"; // Adjust the import path accordingly
import { useNavigate } from "react-router-dom";
import { GetProduct } from "../../apicalls/products";
import Filters from "./Filters";
import moment from "moment";
import NavbarHome from "../../components/NavbarHome";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  fontFamily: "Montserrat, sans-serif",
}));

const Navbar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(45deg, #f8bbd0 30%, #ec407a 90%)",
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontFamily: "Montserrat, sans-serif",
  cursor: "pointer",
}));

const Section = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}));

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  cursor: "pointer", // Add cursor pointer to indicate clickability
}));

function Men() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: ["Men"], // Initial category filter set to "men"
    age: [],
    itemType: [],
    material: [],
    color: [],
    searchQuery: "", // Add searchQuery to filters
  });
  const [showFilters, setShowFilters] = useState(false); // Initially hide filters

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProduct(filters);
      console.log("API Response:", response); // Log the response
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]); // Fetch products whenever filters change

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery,
    }));
  };

  return (
    <Root>
      <NavbarHome/>
      <Section>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Filters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              setFilters={setFilters}
              fetchData={getData} // Pass fetchData function to Filters component
            />
          </Grid>
          <Grid item xs={12} sm={showFilters ? 9 : 12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {!showFilters && (
                  <IconButton onClick={() => setShowFilters(!showFilters)}>
                    <i className="ri-equalizer-line text-xl cursor-pointer"></i>
                  </IconButton>
                )}
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Search Products here..."
                  className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
                  onChange={handleSearch} // Handle search input change
                />
              </Grid>
              {products?.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <ProductCard>
                    <img
                      src={product.images[0]}
                      className="w-full h-52 p-2 rounded-md object-cover"
                      alt={product.name}
                    />
                    <div className="px-2 flex flex-col">
                      <Typography variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        {product.age} {product.age === 1 ? "year" : "years"} old
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="h5" component="p" color="textSecondary">
                        &#8377; {product.price}
                      </Typography>
                    </div>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Section>
    </Root>
  );
}

export default Men;
