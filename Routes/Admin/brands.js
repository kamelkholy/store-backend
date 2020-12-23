const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();
const Brand = require(`${appRoot}/Models/Admin/brand`);
router.get("/:id?", async function (req, res) {
  if (req.params.id) {
    const placeholder = await Brand.getById(req.params.id);
    return res.json(placeholder);
  }
  const placeholders = await Brand.getAll();
  return res.json(placeholders);
});
router.post("/", function (req, res) {
  let placeholder = new Brand({
    name: req.body.name,
    sortOrder: req.body.sortOrder,
  });
  placeholder.save(function (err, placeholder) {
    if (err) {
      console.error(err);
      return res.send("error");
    }
    return res.send(placeholder.name);
  });
});
router.put("/:id", async function (req, res) {
  const placeholder = await Brand.updateById(req.params.id, req.body);
  return res.send(placeholder);
});
router.delete("/:id?", async function (req, res) {
  if (req.params.id) {
    const placeholder = await Brand.deleteById(req.params.id);
    return res.send("deleted by id");
  } else if (req.body.ids && req.body.ids.length > 0) {
    const placeholder = await Brand.deleteByIds(req.params.ids);
    return res.send("deleted by ids");
  }
  return res.send("No Delete");
});
module.exports = router;
