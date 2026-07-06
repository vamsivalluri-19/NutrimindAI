import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AIService } from '../services/ai.service';
import { Profile } from '../models/Profile';
import { ChatHistory } from '../models/ChatHistory';

export const getDietPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: 'User profile not found. Please complete profile setup first.' });
    }

    const { preferences } = req.body;
    const plan = await AIService.generateDietPlan(
      profile.fitnessGoal,
      profile.age,
      profile.weight,
      profile.height,
      profile.activityLevel,
      profile.lifestyle
    );

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const getWorkoutPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: 'User profile not found. Please complete profile setup first.' });
    }

    const plan = await AIService.generateWorkoutPlan(
      profile.fitnessGoal,
      profile.workoutPreference,
      profile.fitnessGoal
    );

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const chatWithCoach = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Retrieve or initialize chat history
    let history = await ChatHistory.findOne({ userId: req.user.id });
    if (!history) {
      history = new ChatHistory({ userId: req.user.id, messages: [] });
    }

    // Add user message
    history.messages.push({
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    });

    // Formulate context input (max 10 recent messages to keep token context concise)
    const contextMessages = history.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await AIService.getChatResponse(contextMessages);

    // Save assistant reply
    history.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    });

    await history.save();

    res.json({
      reply,
      history: history.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const history = await ChatHistory.findOne({ userId: req.user.id });
    res.json(history ? history.messages : []);
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    await ChatHistory.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    next(error);
  }
};

export const getGroceryList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // Mock shopping list generator
    const groceryList = [
      { category: 'Proteins', items: ['Chicken Breast (1kg)', 'Fresh Salmon fillets (500g)', 'Greek Yogurt (3 tubs)'] },
      { category: 'Vegetables', items: ['Spinach (2 bags)', 'Broccoli (3 heads)', 'Cherry Tomatoes (2 packs)', 'Avocado (4 whole)'] },
      { category: 'Carbohydrates & Grains', items: ['Rolled Oats (1kg)', 'Brown Rice (1kg)', 'Sweet Potatoes (1.5kg)', 'Quinoa (500g)'] },
      { category: 'Healthy Fats & Others', items: ['Extra Virgin Olive oil (1 bottle)', 'Almonds (200g)', 'Chia Seeds (1 pack)'] }
    ];

    res.json({
      title: 'AI Smart Shopping List',
      groceryList
    });
  } catch (error) {
    next(error);
  }
};
