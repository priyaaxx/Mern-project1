import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBids, GetProductById, PlaceNewBid } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";
import NavbarHome from "../../components/NavbarHome";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [showBids, setShowBids] = useState(false); // State to control displaying bids
  const dispatch = useDispatch();
  const { id } = useParams();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({
          ...response.data,
          bids: bidsResponse.data || [],
        });

        // Assuming showBids is a boolean value in product data
        setShowBids(response.data.showBids);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleToggleBidModal = () => {
    setShowAddNewBid(!showAddNewBid);
  };

  const handlePlaceBid = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await PlaceNewBid({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        console.log("Bid added successfully");
        getData(); // Refresh product data after bid
        setShowAddNewBid(false); // Close modal
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to place bid:", error.message);
      dispatch(SetLoader(false));
    }
  };

  return (
    product && (
      <div>
        <NavbarHome/>
      
      <Grid container spacing={2} mt={5}>
      
        {/* Images */}
        <Grid item xs={12} md={6}>
          <div className="flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              alt=""
              className="w-full h-96 object-contain rounded-md"
            />
            <div className="flex gap-5">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className={`w-20 h-20 object-contain rounded-md cursor-pointer ${
                    selectedImageIndex === index
                      ? "border-2 border-green-700 border-dashed p-2"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  src={image}
                  alt=""
                />
              ))}
            </div>
            <Divider />
            <div>
              <Typography variant="subtitle1" color="textSecondary">
                Added On
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {moment(product.createdAt).format("MMM D , YYYY hh:mm A")}
              </Typography>
            </div>
          </div>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <div className="flex flex-col gap-3">
            <div>
              <Typography variant="h5" color="primary">
                {product.name}
              </Typography>
              <Typography variant="body1">{product.description}</Typography>
            </div>
            <Divider />
            <div className="flex flex-col">
              <Typography variant="h5" color="primary">
                Product Details
              </Typography>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Price</Typography>
                <Typography variant="body1">&#8377; {product.price}</Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Category</Typography>
                <Typography variant="body1" className="uppercase">
                  {product.category}
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Bill Available</Typography>
                <Typography variant="body1">
                  {product.billAvailable ? "Yes" : "No"}
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Box Available</Typography>
                <Typography variant="body1">
                  {product.boxAvailable ? "Yes" : "No"}
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Accessories Available</Typography>
                <Typography variant="body1">
                  {product.accessoriesAvailable ? "Yes" : "No"}
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Warranty Available</Typography>
                <Typography variant="body1">
                  {product.warrantyAvailable ? "Yes" : "No"}
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Purchased Year</Typography>
                <Typography variant="body1">
                  {moment().subtract(product.age, "years").format("YYYY")} ({product.age} years ago)
                </Typography>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <Typography variant="h5" color="primary">
                Seller Details
              </Typography>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Name</Typography>
                <Typography variant="body1">{product.seller.name}</Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body1">Email</Typography>
                <Typography variant="body1" className="uppercase">
                  {product.seller.email}
                </Typography>
              </div>
            </div>
            <Divider />
            {/* Bids Section */}
            <div className="flex flex-col">
              <Typography variant="h5" color="primary">
                Bids
              </Typography>
              {/* Always show New Bid button */}
              <div className="flex justify-between mb-5">
                <Button
                  onClick={handleToggleBidModal}
                  disabled={user?._id === product.seller._id}
                >
                  New Bid
                </Button>
              </div>
              {/* Conditionally render bids */}
              {showBids && (
                product.bids.length > 0 ? (
                  product.bids.map((bid, index) => (
                    <div key={index} className="border border-gray-300 border-solid p-3 rounded mt-5">
                      <div className="flex justify-between text-gray-700">
                        <span>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount</span>
                        <span>&#8377; {bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Placed On</span>
                        <span>{moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No bids yet.
                  </Typography>
                )
              )}
            </div>
          </div>
        </Grid>

        {/* Bid Modal */}
        {showAddNewBid && (
          <BidModal
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
            product={product}
            reloadData={getData}
            handlePlaceBid={handlePlaceBid} 
          />
        )}
      </Grid>
      </div>
    )
  );
}

export default ProductInfo;
