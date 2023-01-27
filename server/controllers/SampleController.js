const SampleModel = require("../models/sampleModel");

module.exports.getFunction = (req, res) => {
    SampleModel.find({}, { "_id": 1 }, (err, items) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ msg: err });
        }

        if (items)
            return res.status(200).send({ items });
        else return res.status(418).send({});
    });
};
