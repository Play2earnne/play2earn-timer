const express = require("express");
const { getPromotionData, getGameHistory, getMyHistory, placeBetTrx } = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.post("/trx-bet", placeBetTrx);

module.exports = router;
