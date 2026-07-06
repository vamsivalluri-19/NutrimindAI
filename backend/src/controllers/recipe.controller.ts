import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createRecipe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const newRecipe = new Recipe({
      ...req.body,
      authorId: req.user.id,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

export const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, cuisine } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;

    const recipes = await Recipe.find(filter);
    
    // Fallback default recipe seeding if database is empty for client testing
    if (recipes.length === 0) {
      const seeded = [
        {
          title: 'High Protein Chicken Salad',
          description: 'A quick salad featuring lean chicken breasts, rich avocado, and crisp greens.',
          ingredients: ['150g grilled chicken breast', '1/2 avocado', '2 cups mixed greens', '5 cherry tomatoes', '1 tbsp olive oil'],
          instructions: ['Chop chicken breast and avocado into bite-sized cubes.', 'Toss greens and tomatoes in a serving bowl.', 'Top with chicken and avocado, then drizzle with olive oil.'],
          category: 'HIGH_PROTEIN',
          cuisine: 'Italian',
          prepTimeMinutes: 10,
          cookTimeMinutes: 0,
          calories: 380,
          protein: 35,
          carbs: 8,
          fat: 22,
          servings: 1
        },
        {
          title: 'Creamy Keto Avocado Smoothie',
          description: 'A smooth, high-fat shake perfect for keto diets.',
          ingredients: ['1 whole ripe avocado', '1 cup unsweetened almond milk', '1 scoop vanilla protein powder', '1 tbsp chia seeds'],
          instructions: ['Slice avocado and remove the pit.', 'Add all ingredients into a blender.', 'Blend on high speed until completely smooth.'],
          category: 'KETO',
          cuisine: 'American',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          calories: 420,
          protein: 25,
          carbs: 12,
          fat: 32,
          servings: 1
        }
      ];
      return res.json(seeded);
    }

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};
