const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  isSubCategory: {
    type: Boolean,
    default: false
  },
  isParent: {
    type: Boolean,
    default: function () {
      return this.subCategories.length > 0;
    },
  },
  sortOrder: { type: Number, default: 0 },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});
CategorySchema.statics = {
  getAll: async function (sort, page, limit = 10) {
    return await this.find();
  },
  getNonSub: async function (sort, page, limit = 10) {
    return await this.find({ isSubCategory: false });
  },
  query: function (filters, search, sort, page) { },
  getById: async function (id) {
    return await this.findById(id).populate("subCategories").exec();
  },
  deleteById: async function (id) {
    return await this.deleteOne({ _id: id });
  },
  deleteByIds: async function (ids) {
    return await this.deleteMany({ _id: { $in: ids } });
  },
  updateById: async function (id, data) {
    if (data.subCategories && data.subCategories.length > 0) {
      data['$push'] = { subCategories: { '$each': data.subCategories } }
      await this.updateMany(
        { _id: { $in: data.subCategories } },
        { isSubCategory: true }
      );
    }
    delete data.subCategories;
    return await this.findByIdAndUpdate(id, data, { new: true });
  },
};
function autoPopulateSubs(next) {
  this.populate('subCategories');
  next();
}
CategorySchema
  .pre('findOne', autoPopulateSubs)
  .pre('find', autoPopulateSubs);
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
