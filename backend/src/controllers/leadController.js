import Lead from '../models/Lead.js'

export const getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const [leads, total] = await Promise.all([
      Lead.find()
        .populate('product', 'name price images slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(+limit),
      Lead.countDocuments()
    ])
    res.json({ leads, total, pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getLeadsByProduct = async (req, res) => {
  try {
    const leads = await Lead.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
    res.json(leads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}