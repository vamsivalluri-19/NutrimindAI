import { Router } from 'express';
import { getRecipes, createRecipe } from '../controllers/recipe.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { RecipeSchema } from '@nutrimind/shared';

const router = Router();

router.get('/', getRecipes);
router.post('/', authenticate, validateBody(RecipeSchema), createRecipe);

export default router;
