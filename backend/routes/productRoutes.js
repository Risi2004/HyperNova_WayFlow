const express = require('express')
const { sql } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// GET /api/products - List products with search, brand filter, and pagination
router.get('/', async (req, res) => {
  const { brand, temp, search, sortBy = 'product_id', sortOrder = 'ASC' } = req.query

  try {
    let query = `SELECT product_id, product_name, brand, temperature_requirement,
                        weight_per_unit, volume_per_unit, unit, created_at
                 FROM products WHERE 1=1`
    const params = []

    if (brand && brand !== 'All') {
      params.push(brand)
      query += ` AND brand = $${params.length}`
    }

    if (temp && temp !== 'All') {
      params.push(temp.toLowerCase())
      query += ` AND LOWER(temperature_requirement) = $${params.length}`
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`)
      query += ` AND (LOWER(product_name) LIKE $${params.length} OR LOWER(product_id) LIKE $${params.length})`
    }

    // Safe sorting columns
    const allowedSort = ['product_id', 'product_name', 'brand', 'weight_per_unit', 'volume_per_unit', 'created_at']
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'product_id'
    const safeOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

    query += ` ORDER BY ${safeSort} ${safeOrder}`

    // Products and summary statistics are independent, so both queries run at once.
    const [products, statsRes] = await Promise.all([sql.query(query, params), sql.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN brand = 'Fresh' THEN 1 END) as fresh_count,
        COUNT(CASE WHEN brand = 'Tech' THEN 1 END) as tech_count,
        COUNT(CASE WHEN brand = 'Style' THEN 1 END) as style_count,
        COUNT(CASE WHEN LOWER(temperature_requirement) = 'reefer' THEN 1 END) as reefer_count,
        COUNT(CASE WHEN LOWER(temperature_requirement) = 'ambient' THEN 1 END) as ambient_count,
        ROUND(AVG(weight_per_unit)::numeric, 2) as avg_weight,
        ROUND(AVG(volume_per_unit)::numeric, 4) as avg_volume
      FROM products
    `)])

    res.json({
      success: true,
      products,
      stats: statsRes[0] || {},
    })
  } catch (err) {
    console.error('Error fetching products:', err)
    res.status(500).json({ error: 'Failed to retrieve products catalog.' })
  }
})

// POST /api/products - Admin creates new product
router.post('/', verifyToken, requireRole(['Admin']), async (req, res) => {
  let {
    product_id,
    product_name,
    brand,
    temperature_requirement,
    weight_per_unit,
    volume_per_unit,
    unit,
  } = req.body

  if (!product_name || !brand || !temperature_requirement || weight_per_unit === undefined || volume_per_unit === undefined || !unit) {
    return res.status(400).json({
      error: 'Please fill in all mandatory fields: Product Name, Brand, Temperature Requirement, Weight, Volume, and Unit.',
    })
  }

  // Auto-generate product_id if not supplied
  if (!product_id || !product_id.trim()) {
    const prefix = brand === 'Fresh' ? 'PRD-FR' : brand === 'Tech' ? 'PRD-TC' : 'PRD-ST'
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    product_id = `${prefix}-${randomSuffix}`
  }

  try {
    // Check if ID exists
    const existing = await sql.query(`SELECT product_id FROM products WHERE product_id = $1`, [product_id.trim()])
    if (existing.length > 0) {
      return res.status(409).json({ error: `Product ID '${product_id}' already exists in catalog.` })
    }

    const inserted = await sql.query(
      `INSERT INTO products (
        product_id, product_name, brand, temperature_requirement,
        weight_per_unit, volume_per_unit, unit
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        product_id.trim(),
        product_name.trim(),
        brand,
        temperature_requirement.toLowerCase(),
        parseFloat(weight_per_unit),
        parseFloat(volume_per_unit),
        unit.trim(),
      ]
    )

    res.status(201).json({
      success: true,
      product: inserted[0],
      message: `Product ${product_id} successfully added to catalog.`,
    })
  } catch (err) {
    console.error('Error adding product:', err)
    res.status(500).json({ error: 'Database error creating product.' })
  }
})

// PUT /api/products/:id - Admin updates a product
router.put('/:id', verifyToken, requireRole(['Admin']), async (req, res) => {
  const { id } = req.params
  const {
    product_name,
    brand,
    temperature_requirement,
    weight_per_unit,
    volume_per_unit,
    unit,
  } = req.body

  try {
    const updated = await sql.query(
      `UPDATE products SET
        product_name = COALESCE($1, product_name),
        brand = COALESCE($2, brand),
        temperature_requirement = COALESCE($3, temperature_requirement),
        weight_per_unit = COALESCE($4, weight_per_unit),
        volume_per_unit = COALESCE($5, volume_per_unit),
        unit = COALESCE($6, unit)
      WHERE product_id = $7
      RETURNING *`,
      [
        product_name?.trim(),
        brand,
        temperature_requirement?.toLowerCase(),
        weight_per_unit !== undefined ? parseFloat(weight_per_unit) : null,
        volume_per_unit !== undefined ? parseFloat(volume_per_unit) : null,
        unit?.trim(),
        id,
      ]
    )

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    res.json({
      success: true,
      product: updated[0],
      message: `Product ${id} updated successfully.`,
    })
  } catch (err) {
    console.error('Error updating product:', err)
    res.status(500).json({ error: 'Database error updating product.' })
  }
})

// DELETE /api/products/:id - Admin deletes a product
router.delete('/:id', verifyToken, requireRole(['Admin']), async (req, res) => {
  const { id } = req.params

  try {
    const deleted = await sql.query(`DELETE FROM products WHERE product_id = $1 RETURNING product_id`, [id])
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    res.json({
      success: true,
      message: `Product ${id} removed from catalog.`,
    })
  } catch (err) {
    console.error('Error deleting product:', err)
    res.status(500).json({ error: 'Database error deleting product.' })
  }
})

module.exports = router
