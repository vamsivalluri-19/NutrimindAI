import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { SupportTicket } from '../models/SupportTicket';

// Global local cache for AI Prompt templates, allowing updates on the fly
export let aiPromptTemplate = {
  dietPrompt: 'Act as a professional sports dietitian. Analyze the demographic details, height, weight, activity levels, and preferences of the user. Formulate a personalized meal schedule in JSON format.',
  workoutPrompt: 'Act as an expert fitness personal trainer. Devise a structured strength and conditioning split matching preferences. Include warmups, core sets, repetitions, and rest guidelines.'
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;
    const filter: any = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const listTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await SupportTicket.find().populate('userId', 'firstName lastName email');
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const replyToTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { message, responderId } = req.body;

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    ticket.responses.push({
      responderId,
      message,
      timestamp: new Date()
    });
    ticket.status = 'IN_PROGRESS';

    await ticket.save();
    res.json({ message: 'Response added to ticket successfully', ticket });
  } catch (error) {
    next(error);
  }
};

export const getPromptConfig = async (req: Request, res: Response, next: NextFunction) => {
  res.json(aiPromptTemplate);
};

export const updatePromptConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dietPrompt, workoutPrompt } = req.body;
    if (dietPrompt) aiPromptTemplate.dietPrompt = dietPrompt;
    if (workoutPrompt) aiPromptTemplate.workoutPrompt = workoutPrompt;

    res.json({ message: 'AI Prompts config updated successfully', config: aiPromptTemplate });
  } catch (error) {
    next(error);
  }
};
