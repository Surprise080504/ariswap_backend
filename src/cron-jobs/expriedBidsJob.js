"user strict";

const cron = require("node-cron");
const moment = require("moment");
const Bid = require("../api/models/bids.model");

module.exports.startCron = () => {
  try {
    cron.schedule("*/20 * * * * ", async () => {
      const allBids = await Bid.find();

      // console.log('allBids => ', allBids);

      allBids.forEach(async (bid) => {
        const date1 = moment();
        const date2 = moment(bid.expiryDate, "DD.MM.YYYY HH.mm.ss");
        const isExpire = date2.diff(date1) > 0 ? false : true;
        if (isExpire) {
          await Bid.findByIdAndUpdate(
            { _id: bid.bidId },
            { isClaimable: true }
          );
        }
      });
    });
  } catch (err) {
    // console.log(error);
  }
};
