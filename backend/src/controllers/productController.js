import Product from '../models/Product.js'
import Lead from '../models/Lead.js'

export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, size, search, page = 1, limit = 12 } = req.query
    const query = { isActive: true }

    if (category) query.category = category
    if (size) query.sizes = size
    if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) }
    if (search) query.name = { $regex: search, $options: 'i' }

    const [products, total] = await Promise.all([
      Product.find(query).skip((page - 1) * limit).limit(+limit).sort({ createdAt: -1 }),
      Product.countDocuments(query)
    ])

    res.json({ products, total, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const trackWhatsAppClick = async (req, res) => {
  try {
    const { productId, selectedSize, userEmail } = req.body
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { whatsappClicks: 1 } },
      { new: true }
    )
    await Lead.create({
      product: productId,
      productName: product.name,
      productPrice: product.price,
      selectedSize,
      userId: req.user?._id,
      userEmail,
      ip: req.ip
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// CRUD Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}