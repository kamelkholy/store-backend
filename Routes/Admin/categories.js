const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();
const Category = require(`${appRoot}/Models/Admin/category`);
router.get("/:id?", async function (req, res) {
  let placeholder = [];
  if (req.params.id) {
    placeholder = await Category.getById(req.params.id);
  } else if (req.query.nonSub == "true") {
    placeholder = await Category.getNonSub();
  } else {
    placeholder = await Category.getAll();
  }
  return res.json(placeholder);
});
router.post("/", async function (req, res) {
  let placeholder = new Category(req.body);
  await placeholder.save();
  if (req.body.subCategories && req.body.subCategories.length > 0) {
    await Category.updateMany(
      { _id: { $in: req.body.subCategories } },
      { isSubCategory: true }
    );
  }
  return res.send(placeholder.name);
});
router.post("/:id", async function (req, res) {

  let placeholder = await Category.getById(req.params.id);
  const index = placeholder.subCategories.findIndex(x => x._id == req.body.subCategory);
  if (index > -1) {
    placeholder.subCategories.splice(index, 1);
  }
  await placeholder.save();
  await Category.updateById(req.body.subCategory, { isSubCategory: false });
  return res.send(placeholder);
});
router.put("/:id", async function (req, res) {
  const placeholder = await Category.updateById(req.params.id, req.body);
  return res.send(placeholder);
});
router.delete("/:id?", async function (req, res) {
  if (req.params.id) {
    const placeholder = await Category.deleteById(req.params.id);
    return res.send("deleted by id");
  } else if (req.body.ids && req.body.ids.length > 0) {
    const placeholder = await Category.deleteByIds(req.body.ids);
    return res.send("deleted by ids");
  }
  return res.send("No Delete");
});
module.exports = router;
