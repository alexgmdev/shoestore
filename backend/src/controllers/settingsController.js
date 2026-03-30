import Settings from '../models/Settings.js'

// Obtener o crear configuración inicial
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({
        whatsappNumber: '573001234567',
        storeName: 'ShoeStore',
        storeEmail: 'contacto@shoestore.com',
        storeAddress: 'Cali, Colombia'
      })
    }
    res.json(settings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateSettings = async (req, res) => {
  try {
    const { whatsappNumber, storeName, storeEmail, storeAddress, imageInicio } = req.body
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({ whatsappNumber, storeName, storeEmail, storeAddress, imageInicio })
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { whatsappNumber, storeName, storeEmail, storeAddress, imageInicio },
        { new: true, runValidators: true }
      )
    }
    res.json(settings)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}