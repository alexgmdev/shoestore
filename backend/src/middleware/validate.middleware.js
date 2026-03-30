export const validateBody = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field])
  if (missing.length > 0) {
    return res.status(400).json({
      message: `Campos requeridos faltantes: ${missing.join(', ')}`
    })
  }
  next()
}