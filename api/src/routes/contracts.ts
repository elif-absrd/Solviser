import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get dropdown options by category
router.get('/dropdown-options/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const categoryData = await prisma.contractDropdownCategory.findUnique({
      where: { name: category },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!categoryData) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      category: categoryData.name,
      options: categoryData.options
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dropdown options' });
  }
});

// Get contract template
router.get('/templates/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    const template = await prisma.contractTemplate.findFirst({
      where: { 
        type,
        isActive: true,
        isDefault: true
      }
    });

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract template' });
  }
});

export default router;