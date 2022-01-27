const Item = require('../models/itemSchema');

async function getAllItems() {
  return await Item.find();
}

async function getItem(id) {
  const item = await Item.findOne({id: id});
  if (item) {
    return item;
  }
  return null;
}

async function addItem(itemData) {
  const item = new Item();

  item.name = itemData.name;
  item.description = itemData.description;
  item.price = itemData.price;
  item.quantity = itemData.quantity;
  item.imgExt = itemData.imgExt;

  await item.save();
  return item;
}

async function updateItem(itemData) {
  const item = await getItem(itemData.id);

  if (!item) {
    return null;
  }

  item.name = itemData.name;
  item.description = itemData.description;
  item.price = itemData.price;
  item.quantity = itemData.quantity;
  item.imgExt = itemData.imgExt;

  await item.save();
}

module.exports = {getAllItems, getItem, addItem, updateItem};
