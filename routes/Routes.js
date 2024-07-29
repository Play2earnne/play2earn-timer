const express = require("express");
const {
  getPromotionData,
  getGameHistory,
  getMyHistory,
  placeBetTrx,
  loginPage,
  gameHistoryWingo,
  myHistoryWingo,
  placeBetWingo,
  getBalance,
  winningInformation,
  getLevelIncome,
  getLevels,
} = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
///////////////////// trx api //////////////
router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.post("/trx-bet", placeBetTrx);
router.post("/user_login", loginPage);
router.get("/userwallet", getBalance);

////////   wingo api ///////////////////
router.get("/getbet-game-results", myHistoryWingo); /// my history
router.get("/colour_result", gameHistoryWingo); /// game history
router.post("/bet", placeBetWingo); /// game history
router.get("/winning-list", winningInformation); /// game history

/////////////////// general api's /////////////////////
router.get("/get-level", getLevels);

module.exports = router;
