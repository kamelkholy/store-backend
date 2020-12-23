const mongoose = require("mongoose");
const TypeSchema = new mongoose.Schema({
  name: String,
  description: String,
  sortOrder: { type: Number, default: 0 },
  items: [{}],
});
TypeSchema.statics = {
  getAll: async function (sort, page, limit = 10) {
    return await this.find().populate("subCategories");
  },
  query: function (filters, search, sort, page) { },
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
    if (data.items && data.items.length > 0) {
      data['$push'] = { items: { '$each': data.items } }
    }
    delete data.items;
    return await this.findByIdAndUpdate(id, data, { new: true });
  },
};

const Type = mongoose.model("Type", TypeSchema);
module.exports = Type;
