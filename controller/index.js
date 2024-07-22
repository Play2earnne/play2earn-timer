const schedule = require("node-cron");
const {
  oneMinColorWining,
  oneMinColorWinning2min,
  oneMinColorWinning3sec,
  queryDb,
  oneMinTrxSendReleasNumber,
  oneThreeTrxSendReleasNumber,
  oneFiveTrxSendReleasNumber,
  functionToreturnDummyResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");

const { getAlredyPlacedBet } = require("../helper/adminHelper");
const { failMsg } = require("../helper/helperResponse");

exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  const job = schedule.schedule("* * * * * *", function () {
    // setInterval(() => {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    if (timeToSend === 3) {
      // oneMinCheckResult();
      oneMinColorWining();
    }
    // }, 1000);
  });
};

exports.generatedTimeEveryAfterEveryThreeMin = (io) => {
  let min = 2;
  const job = schedule.schedule("* * * * * *", function () {
    // setInterval(() => {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemin", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 25) {
      // oneMinCheckResult2min();
      oneMinColorWinning2min();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
    //  }, 1000);
  });
};

exports.generatedTimeEveryAfterEveryFiveMin = (io) => {
  let min = 4;
  const job = schedule.schedule("* * * * * *", function () {
    // setInterval(() => {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemin", `${min}_${timeToSend}`);

    if (
      timeToSend === 40 && // this is for sec
      min === 0 // this is for minut
    ) {
      // oneMinCheckResult3sec();
      oneMinColorWinning3sec();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 2 when it reaches 0
    }
    // }, 1000);
  });
};

exports.sendOneMinResultToDatabase = async (time, obj) => {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_one_min_result(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    num,
    String(moment(time).format("HH:mm:ss")),
    1,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify(obj),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });

  ////////////// result sent to the  api //////////////
  const parameter = {
    number: num,
    gameid: 1,
  };
  oneMinTrxSendReleasNumber(parameter);
};

exports.generatedTimeEveryAfterEveryThreeMinTRX = (io) => {
  let min = 2;
  let twoMinTrxJob = schedule.schedule("* * * * * *", function () {
    // setInterval(() => {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome;
      // .add(5, "hours").add(30, "minutes").valueOf();

      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendThreeMinResultToDatabase(time, obj);
            } else {
              sendThreeMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendThreeMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
    // }, 1000);
  });
};
async function sendThreeMinResultToDatabase(time, obj) {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_three_min_result(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    num,
    String(moment(time).format("HH:mm:ss")),
    2,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify(obj),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });

  ////////////// result sent to the  api //////////////
  const parameter = {
    number: num,
    gameid: 2,
  };
  oneThreeTrxSendReleasNumber(parameter);
}

exports.generatedTimeEveryAfterEveryFiveMinTRX = (io) => {
  let min = 4;
  let threeMinTrxJob = schedule.schedule("* * * * * *", function () {
    // setInterval(() => {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome;
      // .add(5, "hours").add(30, "minutes").valueOf();

      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendFiveMinResultToDatabase(time, obj);
            } else {
              sendFiveMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendFiveMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 4 when it reaches 0
    }
    // }, 1000);
  });
};

async function sendFiveMinResultToDatabase(time, obj) {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_five_min_result(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    num,
    String(moment(time).format("HH:mm:ss")),
    3,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify(obj),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });

  ////////////// result sent to the  api //////////////
  const parameter = {
    number: num,
    gameid: 3,
  };
  oneFiveTrxSendReleasNumber(parameter);
}

exports.getPromotionData = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Id is missing or invalid" });
    }

    const query = `SELECT * FROM user;`;
    const result = await queryDb(query, []);

    const array = result.map((i) => ({
      ...i,
      count: 0,
      teamcount: 0,
      directReferrals: [],
    }));

    let new_data = updateReferralCountnew(array).find((i) => i.id == id);

    const levels = Array.from({ length: 22 }, (_, i) => `level_${i + 1}`);
    let direct_ids = new_data.directReferrals?.map((i) => i?.c_id);
    let indirect_ids = [];

    for (let i = levels.length - 1; i >= 0; i--) {
      let currentLevel = new_data?.teamMembersByLevel[levels[i - 1]];
      let nextLevel = new_data?.teamMembersByLevel[levels[i]];

      if (currentLevel && nextLevel) {
        let idsToRemove = currentLevel.map((item) => item.id);
        nextLevel = nextLevel.filter((item) => !idsToRemove.includes(item.id));
        new_data.teamMembersByLevel[levels[i]] = nextLevel;
      }
    }

    for (let i = 1; i <= 22; i++) {
      if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
        indirect_ids.push(
          ...new_data.teamMembersByLevel[`level_${i}`].map((item) => item.id)
        );
      }
    }

    new_data = { ...new_data, deposit_member_amount: [] };

    const promises = [];
    for (let i = 1; i <= 22; i++) {
      if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
        let levelIds = new_data.teamMembersByLevel[`level_${i}`].map(
          (k) => k.id
        );
        const query = `SELECT SUM(tr15_amt) AS total_amount, COUNT(*) AS total_member
          FROM tr15_fund_request
          WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
          ${
            levelIds.length > 0
              ? `tr15_uid IN (${levelIds.join(",")})`
              : "1 = 0"
          }`;

        const promise = queryDb(query, [])
          .then((resultteamamount) => {
            return resultteamamount[0]?.total_amount || 0;
          })
          .catch((err) => {
            console.log(err);
            return 0;
          });

        promises.push(promise);
      } else {
        promises.push(Promise.resolve(0));
      }
    }

    const deposit_member_amounts = await Promise.all(promises);
    new_data.deposit_member_amount = deposit_member_amounts;

    const directQuery = `SELECT SUM(tr15_amt) AS total_amount, COUNT(DISTINCT tr15_uid) AS total_member 
      FROM tr15_fund_request 
      WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
      ${
        direct_ids.length > 0
          ? `tr15_uid IN (${direct_ids.join(",")})`
          : "1 = 0"
      }`;

    const directResult = await queryDb(directQuery, []);

    const indirectQuery = `SELECT SUM(tr15_amt) AS total_amount, COUNT(DISTINCT tr15_uid) AS total_member 
      FROM tr15_fund_request 
      WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
      ${
        indirect_ids.length > 0
          ? `tr15_uid IN (${indirect_ids.join(",")})`
          : "1 = 0"
      }`;

    const indirectResult = await queryDb(indirectQuery, []);

    for (let i = 1; i <= 22; i++) {
      if (!new_data.teamMembersByLevel[`level_${i}`]) {
        new_data.teamMembersByLevel[`level_${i}`] = [];
      }
    }

    return res.status(200).json({
      data: {
        ...new_data,
        deposit_member: directResult[0]?.total_member || 0,
        deposit_recharge: directResult[0]?.total_amount || 0,
        deposit_member_team: indirectResult[0]?.total_member || 0,
        deposit_recharge_team: indirectResult[0]?.total_amount || 0,
      },
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", error: e.message });
  }
};

function updateReferralCountnew(users) {
  const countMap = {};
  const teamCountMap = {};

  users.forEach((user) => {
    countMap[user.id] = 0;
    teamCountMap[user.id] = 0;
    user.directReferrals = [];
  });

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.referral_user_id)) {
      countMap[user.referral_user_id]++;
    }
  });

  const updateTeamCountRecursively = (user) => {
    let totalChildrenCount = 0;
    if (countMap.hasOwnProperty(user.id)) {
      totalChildrenCount += countMap[user.id];
      users.forEach((u) => {
        if (u.referral_user_id === user.id) {
          if (user.referral_user_id !== null) {
            if (
              !user.directReferrals.some((referral) => referral.c_id === u.id)
            ) {
              user.directReferrals.push({
                user_name: u.full_name,
                mobile: u.mobile,
                c_id: u.id,
                id: u.username,
              });
            }
          }
          totalChildrenCount += updateTeamCountRecursively(u);
        }
      });
    }
    return totalChildrenCount;
  };

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.id)) {
      teamCountMap[user.id] = updateTeamCountRecursively(user);
    }
  });

  const updateUserLevelRecursively = (user, level, maxLevel) => {
    if (level === 0 || level > maxLevel) return [];

    const levelMembers = [];
    users.forEach((u) => {
      if (u.referral_user_id === user.id) {
        levelMembers.push({
          full_name: u.full_name,
          id: u.id,
          tr15_amt: u.tr15_amt,
        });
        const children = updateUserLevelRecursively(u, level + 1, maxLevel);
        levelMembers.push(...children);
      }
    });

    return levelMembers;
  };

  users.forEach((user) => {
    user.teamMembersByLevel = {};
    for (let i = 1; i <= 22; i++) {
      const levelMembers = updateUserLevelRecursively(user, 1, i);
      user.teamMembersByLevel[`level_${i}`] = levelMembers;
      if (levelMembers.length === 0) break;
    }
  });

  users.forEach((user) => {
    user.count = countMap.hasOwnProperty(user.id) ? countMap[user.id] : 0;
    user.teamcount = teamCountMap.hasOwnProperty(user.id)
      ? teamCountMap[user.id]
      : 0;
  });

  return users;
}

exports.getGameHistory = async (req, res) => {
  const { gameid, limit } = req.query;

  if (!gameid || !limit) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and limit are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);

  if (typeof num_gameid !== "number" || typeof num_limit !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    const query =
      "SELECT * FROM tr42_win_slot WHERE tr41_packtype = ? ORDER BY tr_transaction_id DESC LIMIT 200";
    await queryDb(query, [Number(num_gameid)])
      .then((result) => {
        return res.status(200).json({
          msg: "Data fetched successfully",
          result: result,
        });
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.getMyHistory = async (req, res) => {
  const { gameid, userid } = req.query;

  if (!gameid || !userid) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and userid are required",
    });
  }
  const num_gameid = Number(gameid);
  const num_userid = Number(userid);

  if (typeof num_gameid !== "number" || typeof num_userid !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    // const query = `SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = ? ORDER BY gamesno DESC LIMIT 100`;
    const query = `SELECT *,tr42_win_slot.tr41_slot_id AS number_result FROM trx_colour_bet LEFT JOIN tr42_win_slot ON trx_colour_bet.gamesno = tr42_win_slot.tr_transaction_id WHERE trx_colour_bet.userid = ? AND trx_colour_bet.gameid = ? 
      ORDER BY 
      trx_colour_bet.gamesno DESC 
      LIMIT 100;`
    await queryDb(query, [Number(num_userid), Number(num_gameid)])
      .then((result) => {
        return res.status(200).json({
          msg: "Data fetched successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.placeBetTrx = async (req, res) => {
  const { amount, gameid, gamesnio, number, userid } = req.body;
  if (gamesnio && Number(gamesnio) <= 1) {
    return res.status(200).json({
      msg: `Refresh your page may be your game history not updated.`,
    });
  }

  if (!amount || !gameid || !gamesnio || !number || !userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  if (userid && Number(userid) <= 0) {
    return res.status(200).json({
      msg: `Please refresh your page`,
    });
  }

  if (Number(amount) <= 0)
    return res.status(200).json({
      msg: `Amount should be grater or equal to 1.`,
    });
  if (gameid && Number(gameid) <= 0)
    return res.status(200).json({
      msg: `Type is not define`,
    });
  if (gameid && Number(gameid) >= 4)
    return res.status(200).json({
      msg: `Type is not define`,
    });

  try {
    const query = `INSERT INTO trx_colour_bet(userid,amount,gameid,number,gamesno,totalamount,commission,status) 
    VALUES(?,?,?,?,?,?,?,?)`;
    await queryDb(query, [
      String(userid),
      String(amount),
      Number(gameid),
      String(number),
      String(gamesnio),
      String(Number(Number(amount) * 0.98)?.toFixed(2)),
      String(Number(Number(amount) * 0.02)?.toFixed(2)),
      "0",
    ])
      .then((newresult) => {
        return res.status(200).json({
          error: "200",
          msg: "Bid Placed Successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.getMy;
