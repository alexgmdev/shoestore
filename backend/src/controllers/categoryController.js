import Category from '../models/Category.js'

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name, order } = req.body
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (exists) return res.status(400).json({ message: 'Esta categoría ya existe' })
    const category = await Category.create({ name, order: order || 0 })
    res.status(201).json(category)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Categoría desactivada' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}