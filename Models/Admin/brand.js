const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema({
  name: String,
  description: String,
  sortOrder: Number,
});
BrandSchema.statics = {
  getAll: async function (sort, page) {
    return await this.find();
  },
  query: function (filters, search, sort, page) {},
  getById: async function (id) {
    return await this.findById(id).exec();
  },
  deleteById: async function (id) {
    return await this.deleteOne({ _id: id });
  },
  deleteByIds: async function (ids) {
    return await this.deleteMany({ _id: { $in: ids } });
  },
  updateById: async function (id, data) {
    return await this.findByIdAndUpdate(id, data, { new: true });
  },
};

const Brand = mongoose.model("Brand", BrandSchema);
module.exports = Brand;
