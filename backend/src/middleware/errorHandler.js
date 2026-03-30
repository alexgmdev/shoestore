export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack)

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ message: `El ${field} ya está registrado` })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido' })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  })
}