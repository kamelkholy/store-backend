const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();
const Type = require(`${appRoot}/Models/Admin/type`);
const { v4: uuidv4 } = require('uuid');

router.get("/:id?", async function (req, res) {
  let placeholder = [];
  if (req.params.id) {
    placeholder = await Type.getById(req.params.id);
  } else {
    placeholder = await Type.getAll();
  }
  return res.json(placeholder);
});
router.post("/", async function (req, res) {
  let placeholder = new Type(req.body);
  if (req.body.items && req.body.items.length > 0) {
    req.body.items = req.body.items.map(item => {
      item['itemId'] = uuidv4();
      return item;
    });
  }
  await placeholder.save();
  return res.send(placeholder.name);
});
router.post("/:id", async function (req, res) {

  let placeholder = await Type.getById(req.params.id);
  const index = placeholder.items.findIndex(x => x.itemId == req.body.itemId);
  if (index > -1) {
    placeholder.items.splice(index, 1);
  }
  delete placeholder.items[req.body.item];
  await placeholder.save();
  await Type.updateById(req.body.subType, { isSubType: false });
  return res.send(placeholder);
});
router.put("/:id", async function (req, res) {
  if (req.body.items && req.body.items.length > 0) {
    req.body.items = req.body.items.map(item => {
      item['itemId'] = uuidv4();
      return item;
    });
  }
  const placeholder = await Type.updateById(req.params.id, req.body);
  return res.send(placeholder);
});
router.delete("/:id?", async function (req, res) {
  if (req.params.id) {
    const placeholder = await Type.deleteById(req.params.id);
    return res.send("deleted by id");
  } else if (req.body.ids && req.body.ids.length > 0) {
    const placeholder = await Type.deleteByIds(req.body.ids);
    return res.send("deleted by ids");
  }
  return res.send("No Delete");
});
module.exports = router;
