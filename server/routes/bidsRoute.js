const router = require("express").Router();
const Bid = require("../models/bidModel");
const authMiddleware = require("../middlewares/authMiddleware");

//place a new bid
router.post("/place-new-bid", authMiddleware,async(req,res)=>{
    try{
        const newBid = new Bid(req.body);
        await newBid.save();
        res.send({success: true, message: "Bid placed successfully"});
    } catch(error){
        res.send({success:false, message: error.message});
    }
});

//get all bids

router.post("/get-all-bids", authMiddleware, async (req, res) => {
    try {
        const { product, seller, buyer } = req.body;
        const user = req.user; // Assuming req.user is set by your authMiddleware

        let filters = {};

        if (product) {
            filters.product = product;
        }
        if (seller) {
            filters.seller = seller;
        }
        if (buyer) {
            filters.buyer = buyer; // Use buyer from request body
        } else if (user) {
            filters.buyer = user._id; // Fallback to authenticated user's ID if no explicit buyer provided
        }

        const bids = await Bid.find(filters)
            .populate("product")
            .populate("buyer")
            .populate("seller");

        res.send({ success: true, data: bids });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});


module.exports = router;
