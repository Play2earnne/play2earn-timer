const { queryDb } = require("../helper/adminHelper");
let bet_data = [];
let already_call_functon = true;
exports.aviator_Start_function = async (io) => {
  async function generateAndSendMessage(
    io,
    loss_amount,
    get_counter,
    lossess_amount
  ) {
    let timerInterval;
    let crashInterval;

    let counterboolean = true;
    let total_bet_candidate = 0;
    let bet_sum = 0;
    let find_any_loss_amount_match_with_60_percent = [];
    // await applyBet.deleteMany({})
    const time = Math.floor(100 + Math.random() * (900 - 100));
    console.log(time, "this is time to send to the uer or client");
    io.emit("message", time);
    io.emit("crash", false);
    let fly_time = 0;
    let milliseconds = 0;
    let seconds = 1;

    io.emit("setloder", false);
    io.emit("isFlying", true);

    /////////////////////////////////////////////////////////////////////// start main calculaton for cashs out ///////////////////////////

    ////////////////////////////// interval for timer //////////////////////////////////////////////

    timerInterval = setInterval(async () => {
      if (milliseconds === 100) {
        seconds += 1;
        milliseconds = 0;
      }

      io.emit("seconds", `${String(milliseconds).padStart(2, "0")}_${seconds}`);
      // console.log(
      //   `${String(milliseconds).padStart(2, "0")}_${seconds}`,
      //   "hiii"
      // );
      const newTime = fly_time + 1;
      if (newTime >= time) {
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        already_call_functon &&
          thisFunctonMustBePerFormAfterCrash(
            Number(`${seconds}.${milliseconds}`),
            "pre"
          );
        already_call_functon = false;
        return;
      }

      if (seconds === 1) {
        bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
        const percent_60_bet_amount = bet_sum * (100 / 60);
        find_any_loss_amount_match_with_60_percent = [
          lossess_amount?.find(
            (i) => Number(i?.lossAmount) <= percent_60_bet_amount
          ),
        ];
      }

      milliseconds += 1;
      fly_time = newTime;
    }, 100);

    ///////////////////////////////////// thsi is the calculation of total cashout sum

    crashInterval = setInterval(async () => {
      //////////////////////get counter         ////////////////////////////////////////////

      /// calculation for apply all bets summesion////////////////////////////

      ///////////////////////////////
      // bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
      total_bet_candidate = bet_data?.length;

      const cash_out_sum = bet_data?.reduce((a, b) => a + b?.amountcashed, 0);
      const total_amount_ka_60_percent = bet_sum * (60 / 100); /// 60 percent se upar jayega to crash kra dena hai

      /////////////////// condition for loss amount //////////////////////////

      if (loss_amount !== 0 && bet_sum !== 0) {
        if (get_counter >= 3) {
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          // this_is_recusive_function_for_remove_all_lossAmount_if_counter_greater_than_3(
          //   bet_sum
          // );
          already_call_functon &&
            thisFunctonMustBePerFormAfterCrash(
              Number(`${seconds}.${milliseconds}`),
              "counter_jyada_ho_chuka_hai"
            );
          already_call_functon = false;
          return;
        } else if (loss_amount <= bet_sum) {
          counterboolean = false;
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          clearInterval(timerInterval);
          clearInterval(crashInterval);

          already_call_functon &&
            thisFunctonMustBePerFormAfterCrash(
              Number(`${seconds}.${milliseconds}`),
              "remove_all_loss_and_set_counter_to_zero"
            );
          already_call_functon = false;
          return;
        } else {
          // const percent_60_bet_amount = bet_sum * (100 / 60);
          ///////// yha se vo lossAmount aa jayega jo ki 60% of bet_amount ko veriy kre..
          // const query_for_find_record_less_than_equal_to_60_percent = `SELECT * FROM aviator_loss WHERE lossAmount <= ${percent_60_bet_amount} ORDER BY lossAmount DESC LIMIT 1;`;
          // const find_any_loss_amount_match_with_60_percent = await queryDb(
          //   query_for_find_record_less_than_equal_to_60_percent,
          //   []
          // );
          // const find_any_loss_amount_match_with_60_percent =
          //   lossess_amount?.find(
          //     (i) => Number(i?.lossAmount) <= percent_60_bet_amount
          //   );
          if (
            find_any_loss_amount_match_with_60_percent?.[0] &&
            find_any_loss_amount_match_with_60_percent?.[0]?.lossAmount >
              bet_sum
          ) {
            clearInterval(timerInterval);
            clearInterval(crashInterval);
            clearInterval(timerInterval);
            clearInterval(crashInterval);

            const remaining_amount =
              find_any_loss_amount_match_with_60_percent?.[0]?.lossAmount -
              bet_sum;

            if (
              remaining_amount > 0 &&
              find_any_loss_amount_match_with_60_percent?.[0]
            ) {
              already_call_functon &&
                thisFunctonMustBePerFormAfterCrash(
                  Number(`${seconds}.${milliseconds}`),
                  "loss_if_loss_jyada_hai_bet_amount_se_aur_60_percent_se_koi_match_bhi_kiya_hai",
                  find_any_loss_amount_match_with_60_percent
                );
              already_call_functon = false;
              return;
            }
          } else {
            /////////////////// means bet_amount jyada hai ////////////////////
            if (find_any_loss_amount_match_with_60_percent?.[0]) {
              clearInterval(timerInterval);
              clearInterval(crashInterval);
              clearInterval(timerInterval);
              clearInterval(crashInterval);

              already_call_functon &&
                thisFunctonMustBePerFormAfterCrash(
                  Number(`${seconds}.${milliseconds}`),
                  "recursive_functoin_for_all_removel_amount"
                );
              already_call_functon = false;
              return;
            } else {
              if (bet_sum > 0 && counterboolean && cash_out_sum > 0) {
                counterboolean = false;
                const query_for_incr_counter =
                  "UPDATE aviator_loss_counter SET counter = counter + 1 WHERE id = 1;";
                await queryDb(query_for_incr_counter, []);
              }
            }
          }
        }
      }

      ///////////////////////////////////// thsi is the calculation of total cashout sum

      /////////// conditoin for that if total amount is grater or equal that 500 Rs. creash ////////////////////
      if (total_bet_candidate <= 5 && bet_sum >= 500) {
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        already_call_functon &&
          thisFunctonMustBePerFormAfterCrash(
            Number(`${seconds}.${milliseconds}`)
          );
        already_call_functon = false;
        return;
      }
      ////////////////////// conndition is that means agar cashout 60% se jyada huaa to crash kra do///////////////
      if (cash_out_sum > total_amount_ka_60_percent) {
        console.log("Function is called now 60 percent se jyada");
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        counterboolean = false;
        ///////////////// this is the condition that means if cashout is grater than //////////////////////
        if (cash_out_sum > bet_sum) {
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          already_call_functon &&
            thisFunctonMustBePerFormAfterCrash(
              Number(`${seconds}.${milliseconds}`),
              "sixty_percent_se_jyada_ka_crash"
            );
          already_call_functon = false;
          return;
        } else if (cash_out_sum < bet_sum) {
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          already_call_functon &&
            thisFunctonMustBePerFormAfterCrash(
              Number(`${seconds}.${milliseconds}`),
              "null"
            );
          already_call_functon = false;
          return;
        }
        ///////////////// this is the condition that means if cashout is grater than //////////////////////
      }
      //////////////////// agar bet lgi hui hai to  second 4 se jyada nhi hone chahiye (+1 krna pdega hmesa q ki ui me +1 karke dikhaya gya hai each and everything)
      if (bet_sum > 0) {
        if (Number(seconds >= 3)) {
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          clearInterval(timerInterval);
          clearInterval(crashInterval);
          already_call_functon &&
            thisFunctonMustBePerFormAfterCrash(
              Number(`${seconds}.${milliseconds}`)
            );
          already_call_functon = false;
          return;
        }
      }
    }, 100);

    ////////////// everything converted into sql data base//////////////
    async function this_is_recusive_function_for_remove_all_lossAmount(
      bet_sum
    ) {
      const percent_60_bet_amount = bet_sum * (100 / 60);
      const query_for_find_record_less_than_equal_to_60_percent = `SELECT * FROM aviator_loss WHERE lossAmount <= ${percent_60_bet_amount} ORDER BY lossAmount DESC LIMIT 1;`;
      const find_any_loss_amount_match_with_60_percent = await queryDb(
        query_for_find_record_less_than_equal_to_60_percent,
        []
      );

      // this is the base case..
      if (!find_any_loss_amount_match_with_60_percent) return;
      if (
        find_any_loss_amount_match_with_60_percent?.[0] &&
        find_any_loss_amount_match_with_60_percent?.[0]?.lossAmount > bet_sum
      ) {
        clearInterval(timerInterval);
        clearInterval(crashInterval);
        clearInterval(timerInterval);
        clearInterval(crashInterval);

        const remaining_amount =
          find_any_loss_amount_match_with_60_percent?.[0]?.lossAmount - bet_sum;
        if (
          remaining_amount > 0 &&
          find_any_loss_amount_match_with_60_percent?.[0]
        ) {
          const query_update_record_if_found = `UPDATE aviator_loss SET lossAmount = lossAmount - ${bet_sum} WHERE id = ?`;
          await queryDb(query_update_record_if_found, [
            find_any_loss_amount_match_with_60_percent?.[0]?.id,
          ]);
          return;
        }
      } else {
        if (find_any_loss_amount_match_with_60_percent?.[0]) {
          const query_for_delete_record = `DELETE FROM aviator_loss WHERE id  = ?;`;
          await queryDb(query_for_delete_record, [
            find_any_loss_amount_match_with_60_percent?.[0].id,
          ]);

          // await LossTable.findByIdAndDelete({
          //   _id: find_any_loss_amount_match_with_60_percent?.[0]._id,
          // });
          const total_value_bet_amount_which_is_grater_than_lossAmount =
            bet_sum -
            find_any_loss_amount_match_with_60_percent?.[0]?.lossAmount;
          if (total_value_bet_amount_which_is_grater_than_lossAmount > 0)
            this_is_recusive_function_for_remove_all_lossAmount(
              total_value_bet_amount_which_is_grater_than_lossAmount
            );
        }
      }
    }

    ////////////////// every thing is converted into sql table //////////////////////////////////////////
    async function this_is_recusive_function_for_remove_all_lossAmount_if_counter_greater_than_3(
      bet_sum
    ) {
      console.log("Anand ji ka function call huaa", bet_sum);

      const query_for_finding_loss_amount = `SELECT * FROM aviator_loss ORDER BY lossAmount DESC LIMIT 1; `;
      const find_any_loss_amount_match_with_60_percent = await queryDb(
        query_for_finding_loss_amount,
        []
      );
      // this is the base case..
      if (
        !find_any_loss_amount_match_with_60_percent ||
        find_any_loss_amount_match_with_60_percent.length <= 0
      ) {
        const query_for_update_counter = `UPDATE aviator_loss_counter SET counter = 0 WHERE id = 1;`;
        await queryDb(query_for_update_counter, []);
        //   await SetCounter.findOneAndUpdate({}, { counter: 0 });
        return;
      }

      if (
        find_any_loss_amount_match_with_60_percent[0] &&
        find_any_loss_amount_match_with_60_percent[0].lossAmount > bet_sum
      ) {
        const remaining_amount =
          find_any_loss_amount_match_with_60_percent[0].lossAmount - bet_sum;

        if (remaining_amount > 0) {
          clearInterval(timerInterval);
          clearInterval(crashInterval);

          const query_for_update_loss_amount = `UPDATE aviator_loss SET lossAmount = ? WHERE id = ?;`;
          await queryDb(query_for_update_loss_amount, [
            remaining_amount,
            find_any_loss_amount_match_with_60_percent[0].id,
          ]);
          return;
        }
      } else {
        if (find_any_loss_amount_match_with_60_percent[0]) {
          const query_for_delete_record = `DELETE FROM aviator_loss WHERE id = ?;`;
          await queryDb(query_for_delete_record, [
            find_any_loss_amount_match_with_60_percent[0].id,
          ]);

          const total_value_bet_amount_which_is_greater_than_lossAmount =
            bet_sum - find_any_loss_amount_match_with_60_percent[0].lossAmount;

          if (total_value_bet_amount_which_is_greater_than_lossAmount > 0) {
            return this_is_recusive_function_for_remove_all_lossAmount_if_counter_greater_than_3(
              total_value_bet_amount_which_is_greater_than_lossAmount
            );
          }
        }
      }

      // Check if there are any remaining documents
      // const remaining_documents = await LossTable.find({}).countDocuments();
      // if (remaining_documents === 0) {
      //   await SetCounter.findOneAndUpdate({}, { counter: 0 });
      // }
      const query_for_count_rows = `SELECT COUNT(*) AS count_row FROM aviator_loss;`;
      const response_count = await queryDb(query_for_count_rows, []);
      if (response_count?.[0]?.count_row === 0) {
        const query_for_update_counter = `UPDATE aviator_loss_counter SET counter = 0 WHERE id = 1;`;
        await queryDb(query_for_update_counter, []);
      }
    }

    async function thisFunctonMustBePerFormAfterCrash(time, msg) {
      already_call_functon = false;
      clearInterval(timerInterval);
      clearInterval(crashInterval);
      clearInterval(timerInterval);
      clearInterval(crashInterval);
      console.log("thisFunctonMustBePerFormAfterCrash HOOOOOOO crached");
      // const round = await GameRound?.find({});
      io.emit("crash", true);
      io.emit("isFlying", false);
      io.emit("setcolorofdigit", true);
      io.emit("apply_bet_counter", []);
      io.emit("cash_out_counter", []);

      if (msg === "counter_jyada_ho_chuka_hai") {
        let bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);

        const query_for_remove_from_loss_table = `CALL sp_to_remove_loss_amount_aviator_table(?);`;
        await queryDb(query_for_remove_from_loss_table, [bet_sum]);
      }
      if (
        msg ===
        "loss_if_loss_jyada_hai_bet_amount_se_aur_60_percent_se_koi_match_bhi_kiya_hai"
      ) {
        let bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
        const percent_60_bet_amount = bet_sum * (100 / 60);
        const query_for_find_record_less_than_equal_to_60_percent = `SELECT * FROM aviator_loss WHERE lossAmount <= ${percent_60_bet_amount} ORDER BY lossAmount DESC LIMIT 1;`;
        const find_any_loss_amount_match_with_60_percent = await queryDb(
          query_for_find_record_less_than_equal_to_60_percent,
          []
        );

        const query_update_record_if_found = `UPDATE aviator_loss SET lossAmount = lossAmount - ${bet_sum} WHERE id = ?`;
        await queryDb(query_update_record_if_found, [
          find_any_loss_amount_match_with_60_percent?.[0]?.id,
        ]);
      }

      if (msg === "recursive_functoin_for_all_removel_amount") {
        let bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
        const query_for_remove_60_percent_loss_wala_data =
          "CALL sp_for_release_60_percent_amount_from_loss_table(?,?);";
        await queryDb(query_for_remove_60_percent_loss_wala_data, [
          bet_sum,
          60,
        ]);
      }

      if (msg === "sixty_percent_se_jyada_ka_crash") {
        console.log("sixty_percent_se_jyada_ka_crash");
        const bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
        const cash_out_sum = bet_data?.reduce((a, b) => a + b?.amountcashed, 0);

        const query_for_insert_record_in_loss_table = `INSERT INTO aviator_loss(lossAmount) VALUES(${
          cash_out_sum - bet_sum
        })`;
        await queryDb(query_for_insert_record_in_loss_table, []);
      }
      if (msg === "remove_all_loss_and_set_counter_to_zero") {
        const query_for_truncate_loss_table = `TRUNCATE TABLE aviator_loss;`;
        await queryDb(query_for_truncate_loss_table, []);
        const query_for_update_counter = `UPDATE aviator_loss_counter SET counter = 0 WHERE id = 1;`;
        await queryDb(query_for_update_counter, []);
      }

      const query_for_insert_game_history = `INSERT INTO aviator_game_history(round,multiplier) VALUES(?,?);`;
      await queryDb(query_for_insert_game_history, [
        10000,
        msg === "pre" ? time : time - 0.01,
      ]);

      const saveBetLedgers = async (bet_data) => {
        const query = `
                INSERT INTO aviator_bet_place_ledger (userid, amount, amountcashed, multiplier)
                VALUES (?, ?, ?, ?)
              `;

        // Create an array of promises for insert operations
        const promises = bet_data.map(async (element) => {
          const values = [
            element.userid,
            // element.id,
            element.amount,
            element.amountcashed,
            element.multiplier,
          ];
          return queryDb(query, values);
        });

        // Execute all insert operations
        try {
          await Promise.all(promises);
        } catch (error) {
          console.error("Error saving bet ledgers:", error);
        }
      };

      // Example usage:
      saveBetLedgers(bet_data)
        .then(() => {
          console.log("All ApplyBetLedger objects saved successfully");
        })
        .catch((err) => {
          console.error("Error saving ApplyBetLedger objects:", err);
        });

      setTimeout(() => {
        io.emit("setcolorofdigit", false);
        io.emit("setloder", true);
      }, 3000);
      const query_for_get_total_loss_amount = `SELECT SUM(lossAmount) as sum_total FROM aviator_loss;`;
      let loss_amount = await queryDb(query_for_get_total_loss_amount, []);

      //const set_counter = await SetCounter.find({});
      const query_for_get_counter = `SELECT counter FROM aviator_loss_counter WHERE id = 1;`;
      const set_counter = await queryDb(query_for_get_counter, []);
      let get_counter = set_counter?.[0]?.counter || 0;

      const total_bet_sum = bet_data?.reduce((a, b) => a + b.amount, 0);
      const total_crashed_sum = bet_data?.reduce(
        (a, b) => a + b.amountcashed,
        0
      );

      const query_for_get_admin_wallet = `UPDATE aviator_admin_wallet SET wallet = wallet + ${
        Number(total_bet_sum) - Number(total_crashed_sum)
      }`;
      await queryDb(query_for_get_admin_wallet, []);

      const updateUserWallets = async (bet_data) => {
        // Create a connection to the database
        try {
          // Step 1: Group bet_data by userid and calculate the total wallet change for each user
          const userWalletChanges = bet_data.reduce((acc, element) => {
            const userId = element.userid;
            const amountChange = Number(
              element.amountcashed > 0
                ? element.amountcashed - element.amount
                : -element.amount
            );

            if (!acc[userId]) {
              acc[userId] = 0;
            }
            acc[userId] += amountChange;
            return acc;
          }, {});

          // Step 2: Update each user once with the aggregated wallet change
          const updatePromises = Object.keys(userWalletChanges).map(
            async (userId) => {
              const amountChange = userWalletChanges[userId];
              let query_for_update_wallet = "";
              let params = [];
              if (Number(amountChange) > 0) {
                query_for_update_wallet =
                  "INSERT INTO `tr07_manage_ledger`(m_u_id,m_trans_id,m_cramount,m_description,m_ledger_type,m_game_type) VALUES(?,?,?,?,?,?);";
                params = [
                  Number(userId),
                  Date.now(),
                  Number(amountChange),
                  "User has win in aviator.",
                  "aviator",
                  "Aviator",
                ];
              } else if (Number(amountChange) < 0) {
                query_for_update_wallet =
                  "INSERT INTO `tr07_manage_ledger`(m_u_id,m_trans_id,m_dramount,m_description,m_ledger_type,m_game_type) VALUES(?,?,?,?,?,?);";
                params = [
                  Number(userId),
                  Date.now(),
                  Math.abs(Number(amountChange)),
                  "User has Loss in aviator.",
                  "aviator",
                  "Aviator",
                ];
              }
              return await queryDb(query_for_update_wallet, params);
            }
          );

          // Step 3: Wait for all updates to complete
          await Promise.all(updatePromises);
        } catch (error) {
          console.error("Error updating user wallets:", error);
        }
      };

      // Example usage:
      // updateUserWallets(bet_data)
      //   .then(() => {
      //     console.log("User wallets updated successfully");
      //   })
      //   .catch((err) => {
      //     console.error("Error updating user wallets:", err);
      //   });

      setTimeout(async () => {
        bet_data = [];
        const query_for_get_all_loss_amount =
          "SELECT id,lossAmount FROM aviator_loss ORDER BY lossAmount DESC;";
        const all_lossess = await queryDb(query_for_get_all_loss_amount, [])
          .then((result) => {
            return result;
          })
          .catch((e) => {
            console.log("Error in fetching all lossess");
          });
        generateAndSendMessage(io, loss_amount, get_counter, all_lossess);
        already_call_functon = true;
      }, 30000);
    }
  }
  generateAndSendMessage(io, 0, 0, []);
};

exports.betPlacedAviator = async (req, res) => {
  try {
    const { userid, id, amount, button_type } = req.body;
    if (!userid || !id || !amount)
      return res.status(403).json({
        msg: "All field is required",
      });

    const query_for_update_wallet =
      "CALL aviator_bet_placed(?,?,@result_msg); SELECT @result_msg;";
    const params = [Number(userid), Math.abs(Number(amount))];

    const result = await queryDb(query_for_update_wallet, params);

    if (result?.[1]?.[0]?.["@result_msg"] === "Data save successfully") {
      const new_data = {
        userid: userid,
        id: id,
        amount: amount,
        amountcashed: 0,
        multiplier: 0,
        button_type: button_type,
      };
      bet_data.push(new_data);
    }
    return res.status(200).json({
      msg: result?.[1]?.[0]?.["@result_msg"],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in bet placing",
    });
  }
};

exports.cashOutFunction = async (req, res) => {
  try {
    const { userid, id, amount, multiplier, button_type } = req.body;
    if (!userid || !id || !amount || !multiplier || !button_type)
      return res.status(403).json({
        msg: "All field is required",
      });

    bet_data.forEach((item) => {
      if (item.id === id && item.button_type === button_type) {
        item.amountcashed = amount;
        item.multiplier = multiplier;
      }
    });
    console.log(bet_data);
    const query_for_update_wallet = `UPDATE user SET winning_wallet = winning_wallet + ${Number(
      amount
    )} WHERE id = ?;`;
    const params = [Number(userid)];

    await queryDb(query_for_update_wallet, params);

    ////////////////// revert the final response
    return res.status(200).json({
      msg: "Data save successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in create user query",
    });
  }
};

exports.getGameHistoryAviator = async (req, res) => {
  try {
    const query_for_game_history = `SELECT * FROM aviator_game_history;`;
    const data = await queryDb(query_for_game_history)
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetching game history");
      });
    // const data = await GameHistory.find({});

    if (!data)
      return res.status(400).json({
        msg: "Data not found",
      });
    return res.status(200).json({
      data: data,
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
  }
};
exports.getLederData = async (req, res) => {
  try {
    const query_for_get_ledger =
      "SELECT a.`amount`,a.`amountcashed`,a.`multiplier`,a.`createdAt`,a.`updatedAt`,u.`email`,u.`full_name`,u.`mobile` FROM `aviator_bet_place_ledger` AS a LEFT JOIN `user` AS u ON a.`userid` = u.`id`;";
    // const data = await ApplyBetLedger.find({}).populate("main_id").limit(100);
    const data = await queryDb(query_for_get_ledger)
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetching game history");
      });
    if (!data)
      return res.status(400).json({
        msg: "Data not found",
      });
    return res.status(200).json({
      data: data,
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
  }
};
exports.getWalletByUserId = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    if (!id)
      return res.status(400).json({
        msg: "Undefined uesr id",
      });
    // const data = await User.findById({ _id: id });
    const query_for_get_balance =
      "SELECT wallet,winning_wallet as winning FROM `user` WHERE id = ?;";
    const data = await queryDb(query_for_get_balance, [Number(id)]);

    if (!data)
      return res.status(400).json({
        msg: "User not found",
      });
    return res.status(200).json({
      data: {
        wallet: data?.[0]?.wallet,
        winning: data?.[0]?.winning,
      },
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getMyHistoryByID = async (req, res) => {
  try {
    const { user_id_node } = req.body;
    console.log("HII");
    if (!user_id_node)
      return res.status(400).json({
        msg: "Please provider user id",
      });
    // const data = await ApplyBetLedger.find({ userid: String(user_id_node) });
    const query_for_get_my_history =
      "SELECT * FROM `aviator_bet_place_ledger` WHERE userid = ?;";
    const data = await queryDb(query_for_get_my_history, [
      Number(user_id_node),
    ]);

    if (!data)
      return res.status(400).json({
        msg: "Data not found",
      });
    return res.status(200).json({
      data: data,
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getTopRecordsAviator = async (req, res) => {
  try {
    // const data = await ApplyBetLedger.find({})
    //   .sort({ amountcashed: -1 })
    //   .populate("main_id")
    //   .limit(10);
    const query_for_find_top_winner =
      "SELECT a.`amount`,a.`amountcashed`,a.`multiplier`,a.`createdAt`,a.`updatedAt`,u.`email`,u.`full_name`,u.`mobile` FROM `aviator_bet_place_ledger` AS a LEFT JOIN `user` AS u ON a.`userid` = u.`id` ORDER BY a.`amountcashed` DESC LIMIT 10;";

    const data = await queryDb(query_for_find_top_winner, []);
    return res.status(200).json({
      msg: "Data save successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong in create user query",
    });
  }
};
