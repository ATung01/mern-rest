const express = require('express')
const router = express.Router()
const Item = require('../models/item')

let getItem = async (req, res, next) => {
  let item
  try{
    item = await Item.findById(req.params.id)
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item'})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
  res.item = item
  next()
}

router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.get('/:id', getItem, (req, res) => {
  res.json(res.item)
})

router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name
  })
  try {
    const newItem = await item.save()
    res.status(201).json(newItem)
    // Status 200 means things were successful, 201 means an item was created successfully
  } catch (err) {
    res.status(400).json({message: err.message})
    // status 400 is for bad user input
  }
})

router.patch('/:id', getItem, async (req, res) => {
  if (req.body.name !== null) {
    res.item.name = req.body.name
  }
  // add other checks here when other properties get added to Item schema
  try {
    const updatedItem = await res.item.save()
    res.json(updatedItem)
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.remove()
    res.json({message: 'deleted item'})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})


module.exports = router