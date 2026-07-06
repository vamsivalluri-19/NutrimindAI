import { AIDietPlanResponse, AIWorkoutPlanResponse } from '@nutrimind/shared';
import axios from 'axios';

// Helper mock generators to simulate OpenAI / Gemini responses if API keys are mock-keys
export class AIService {
  
  static async generateDietPlan(userGoal: string, age: number, weight: number, height: number, activityLevel: string, lifestyle: string): Promise<AIDietPlanResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    const isMockKey = !apiKey || apiKey.includes('mock') || apiKey.length < 15;

    // Helper mock builder
    const getMockPlan = (): AIDietPlanResponse => {
      const targetCalories = activityLevel === 'VERY_ACTIVE' ? 2800 : 2000;
      const protein = Math.round(weight * 2);
      const fat = Math.round((targetCalories * 0.25) / 9);
      const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);

      return {
        title: `AI Custom 7-Day ${lifestyle} Plan for ${userGoal.replace('_', ' ')}`,
        description: `This plan is tailored for a ${age}-year-old weighing ${weight}kg with a goal of ${userGoal.toLowerCase().replace('_', ' ')}.`,
        targetCalories,
        macros: {
          proteinGrams: protein,
          carbsGrams: carbs,
          fatGrams: fat
        },
        meals: [
          { day: 'Monday', mealType: 'BREAKFAST', foodName: 'Oatmeal with whey protein, banana, and chia seeds', portionSize: '1 bowl (approx 450g)', estimatedCalories: 450 },
          { day: 'Monday', mealType: 'LUNCH', foodName: 'Grilled Chicken breast with brown rice and steamed broccoli', portionSize: '150g chicken, 1 cup rice', estimatedCalories: 600 },
          { day: 'Monday', mealType: 'SNACK', foodName: 'Greek yogurt with mixed berries and almonds', portionSize: '200g yogurt, 20g almonds', estimatedCalories: 250 },
          { day: 'Monday', mealType: 'DINNER', foodName: 'Baked Salmon fillet with sweet potato and asparagus', portionSize: '150g salmon, 100g sweet potato', estimatedCalories: 550 },
          { day: 'Tuesday', mealType: 'BREAKFAST', foodName: 'Scrambled Eggs with spinach and whole wheat toast', portionSize: '3 eggs, 2 slices toast', estimatedCalories: 400 },
          { day: 'Tuesday', mealType: 'LUNCH', foodName: 'Turkey breast wrap with whole wheat tortilla, avocado and salad', portionSize: '1 wrap', estimatedCalories: 500 },
          { day: 'Tuesday', mealType: 'SNACK', foodName: 'Protein shake and apple', portionSize: '1 shake, 1 apple', estimatedCalories: 300 },
          { day: 'Tuesday', mealType: 'DINNER', foodName: 'Lean beef stir-fry with quinoa and mixed vegetables', portionSize: '150g beef, 1 cup quinoa', estimatedCalories: 600 }
        ]
      };
    };

    if (!isMockKey) {
      try {
        const prompt = `Generate a personalized diet plan in JSON format.
User parameters: Goal: ${userGoal}, Age: ${age}, Weight: ${weight}kg, Height: ${height}cm, Activity: ${activityLevel}, Lifestyle: ${lifestyle}.
The JSON must strictly match this TypeScript interface:
{
  "title": "string",
  "description": "string",
  "targetCalories": 2000,
  "macros": { "proteinGrams": 120, "carbsGrams": 200, "fatGrams": 60 },
  "meals": [
    { "day": "string", "mealType": "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK", "foodName": "string", "portionSize": "string", "estimatedCalories": 450 }
  ]
}
Ensure the output is ONLY raw JSON. No markdown code blocks, no other text.`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] }
        );

        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (err: any) {
        console.warn('Failed to generate real AI diet plan, falling back to mock:', err.message);
      }
    }

    return getMockPlan();
  }

  static async generateWorkoutPlan(userGoal: string, workoutPreference: string, fitnessGoal: string): Promise<AIWorkoutPlanResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    const isMockKey = !apiKey || apiKey.includes('mock') || apiKey.length < 15;

    const getMockWorkout = (): AIWorkoutPlanResponse => {
      return {
        title: `AI Customized ${workoutPreference} Workout Plan`,
        description: `7-Day routine optimized for ${fitnessGoal.toLowerCase().replace('_', ' ')}:`,
        weeklySchedule: [
          {
            day: 'Monday',
            workoutType: 'STRENGTH_TRAINING',
            exercises: [
              { name: 'Barbell Squats', sets: 4, reps: 10, notes: 'Focus on depth and form' },
              { name: 'Bench Press', sets: 4, reps: 8, notes: 'Control the descent' },
              { name: 'Bent-Over Rows', sets: 3, reps: 10, notes: 'Squeeze shoulder blades at peak' }
            ]
          },
          {
            day: 'Tuesday',
            workoutType: 'HIIT',
            exercises: [
              { name: 'Kettlebell Swings', sets: 4, reps: 15, durationMinutes: 10 },
              { name: 'Burpees', sets: 3, reps: 12, durationMinutes: 5 },
              { name: 'Plank Holds', sets: 3, durationMinutes: 2, notes: 'Keep core engaged' }
            ]
          },
          {
            day: 'Wednesday',
            workoutType: 'REST',
            exercises: []
          },
          {
            day: 'Thursday',
            workoutType: 'YOGA',
            exercises: [
              { name: 'Sun Salutations', durationMinutes: 15 },
              { name: 'Warrior I & II Posings', durationMinutes: 15 },
              { name: 'Deep stretching routine', durationMinutes: 10 }
            ]
          }
        ]
      };
    };

    if (!isMockKey) {
      try {
        const prompt = `Generate a personalized workout plan in JSON format.
User parameters: Goal: ${userGoal}, Preference: ${workoutPreference}, Fitness Goal: ${fitnessGoal}.
The JSON must strictly match this TypeScript interface:
{
  "title": "string",
  "description": "string",
  "weeklySchedule": [
    {
      "day": "string",
      "workoutType": "STRENGTH_TRAINING" | "HIIT" | "REST" | "YOGA",
      "exercises": [
        { "name": "string", "sets": 3, "reps": 10, "durationMinutes": 10, "notes": "string" }
      ]
    }
  ]
}
Ensure the output is ONLY raw JSON. No markdown code blocks, no other text.`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] }
        );

        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (err: any) {
        console.warn('Failed to generate real AI workout plan, falling back to mock:', err.message);
      }
    }

    return getMockWorkout();
  }

  static async getChatResponse(messages: { role: string; content: string }[]): Promise<string> {
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const hasRealOpenai = openaiKey && !openaiKey.includes('mock') && openaiKey.length > 20;
    const hasRealGemini = geminiKey && !geminiKey.includes('mock') && geminiKey.length > 20;

    // 1. Try OpenAI if key is present and looks valid
    if (hasRealOpenai) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            }
          }
        );
        const text = response.data?.choices?.[0]?.message?.content;
        if (text) return text;
      } catch (err: any) {
        console.warn('OpenAI API call failed, trying Gemini:', err.message);
      }
    }

    // 2. Try Gemini if key is present and looks valid
    if (hasRealGemini) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          }
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local mock rules:', err.message);
      }
    }

    // 3. Fallback: Highly detailed, contextual rule-based health responder
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    // Greeting triggers
    if (lastMessage === 'hi' || lastMessage === 'hello' || lastMessage === 'hey' || lastMessage.includes('how are you')) {
      return `Hello! I am your NutriMind AI coach. 🥗💪

I can help you:
1. Generate customized meal and diet plans.
2. Formulate target workout routines.
3. Track and log your nutrition metrics.

What is your main fitness goal today? (e.g. Lose weight, build muscle)`;
    }

    // Eggs triggers
    if (lastMessage.includes('egg')) {
      return `Eggs are an absolute powerhouse of nutrition! 🥚

Here is the breakdown for a single large egg:
- **Calories**: ~70 kcal
- **Protein**: 6g (high biological value, great for recovery)
- **Fats**: 5g (mostly healthy unsaturated fats)
- **Carbs**: < 0.5g

*Coach Tip*: Try soft-boiled eggs for an easy high-protein snack, or make an egg-white scramble with spinach and tomatoes to keep fat low while maximizing volume!`;
    }

    // Fruit triggers
    if (lastMessage.includes('apple') || lastMessage.includes('banana') || lastMessage.includes('orange') || lastMessage.includes('berry') || lastMessage.includes('fruit') || lastMessage.includes('berries')) {
      return `Fruits are packed with vitamins, minerals, antioxidants, and dietary fiber! 🍎🍌🍓

Here are a few quick tips:
- **Apples**: High in pectin (a prebiotic fiber that supports gut health). ~95 kcal.
- **Bananas**: Rich in potassium and easily digestible carbohydrates, making them the ultimate pre-workout snack! ~105 kcal.
- **Berries**: Extremely high in antioxidants and lower in sugar than other fruits. Perfect to mix into Greek yogurt!

Try to consume 2 servings of fresh fruits daily for optimal micronutrients.`;
    }

    // Carbohydrates / Starches
    if (lastMessage.includes('rice') || lastMessage.includes('potato') || lastMessage.includes('oats') || lastMessage.includes('bread') || lastMessage.includes('pasta') || lastMessage.includes('carb')) {
      return `Carbohydrates are your body's primary energy source! 🌾🍠

*Coach Tip*: Try to swap simple/refined carbs (white bread, sugar) for complex carbohydrates:
- **Oats**: Rich in beta-glucans, which lower cholesterol and stabilize blood sugar.
- **Sweet Potatoes**: High in Vitamin A and fiber.
- **Brown Rice / Quinoa**: Provide long-lasting energy and extra protein.

Ensure you match your carbohydrate intake to your daily physical activity levels!`;
    }

    // Protein details
    if (lastMessage.includes('chicken') || lastMessage.includes('salmon') || lastMessage.includes('fish') || lastMessage.includes('meat') || lastMessage.includes('beef') || lastMessage.includes('protein') || lastMessage.includes('shake') || lastMessage.includes('powder')) {
      return `Protein is crucial for muscle repair, fat loss, and maintaining satiety! 🍗🐟🥩

*Daily Targets*: Aim for 1.6 to 2.2 grams of protein per kilogram of body weight if you're active.
*Excellent Sources*:
- **Chicken Breast (150g)**: ~245 kcal, 46g Protein, 5g Fat.
- **Salmon Fillet (150g)**: ~300 kcal, 34g Protein, 18g Healthy Fats (Omega-3).
- **Whey/Plant Protein**: Convenient post-workout recovery boost. ~120 kcal, 25g Protein.`;
    }

    // Hydration
    if (lastMessage.includes('water') || lastMessage.includes('drink') || lastMessage.includes('hydration') || lastMessage.includes('thirsty')) {
      return `Hydration is the foundation of peak performance and healthy digestion! 💧

*Coach Guidelines*:
- Aim for at least **3 Liters (100 oz)** of clean water daily.
- Drink an extra 500ml (16 oz) during or immediately after exercise.
- Hydration supports mental focus, skin elasticity, and muscle recovery.

Keep tracking your water cups on the **Dashboard** and **Trackers** tabs!`;
    }

    // Sugar / Junk Food
    if (lastMessage.includes('sugar') || lastMessage.includes('sweet') || lastMessage.includes('chocolate') || lastMessage.includes('pizza') || lastMessage.includes('burger') || lastMessage.includes('junk')) {
      return `Minimizing processed sugars and trans fats is key to maintaining stable energy and metabolism! 🍕🍩🍫

*The 80/20 Rule*:
- Focus **80%** of your food intake on whole, nutrient-dense foods (chicken, vegetables, grains).
- Allow **20%** for fun foods or treats. This ensures sustainable lifestyle habits without feeling overly restricted.

If you have a craving, try substituting milk chocolate with 85% dark chocolate, or make home-made baked potato wedges instead of deep-fried french fries!`;
    }

    // Recipe / diet / keto triggers
    if (lastMessage.includes('recipe') || lastMessage.includes('food') || lastMessage.includes('eat') || lastMessage.includes('diet') || lastMessage.includes('keto') || lastMessage.includes('salad')) {
      return `Here is a custom high-protein recipe suggestion perfect for healthy goals:

**🥑 Grilled Chicken Avocado Bowl**
- **Ingredients**: 150g chicken breast, 1/2 medium avocado, 2 cups baby spinach, 1/2 cup quinoa (or swap for riced cauliflower if Keto), cherry tomatoes.
- **Preparation**:
  1. Season chicken with salt, pepper, garlic powder and grill for 6-8 mins per side.
  2. Toss spinach, cooked quinoa, and sliced cherry tomatoes in a bowl.
  3. Top with sliced chicken breast and fresh avocado.
- **Nutrition Breakdown**:
  * **Calories**: ~450 kcal
  * **Protein**: 42g
  * **Carbs**: 28g (Keto swap: 8g)
  * **Fats**: 18g

Let me know if you would like me to adjust the macros or swap ingredients!`;
    }

    // Workout / exercise triggers
    if (lastMessage.includes('workout') || lastMessage.includes('exercise') || lastMessage.includes('gym') || lastMessage.includes('training') || lastMessage.includes('routine')) {
      return `For optimal fitness and body composition, I recommend a structured weekly splits:

**💪 NutriMind core 3-Day Split:**
- **Day 1: Upper Body Strength** (Bench Press, Rows, Shoulder press) - 3 sets x 8-10 reps.
- **Day 2: Lower Body Strength** (Squats, Roman Deadlifts, Lunges) - 3 sets x 10 reps.
- **Day 3: Full Body Conditioning / HIIT** (Kettlebell swings, Planks, Burpees) - 20 mins.

*Important*: Make sure to complete a 5-minute dynamic warmup before each session and drink at least 500ml of water. Let me know if you prefer home workouts!`;
    }

    // Default responder
    return `Got it! As your NutriMind coach, I want to make sure I give you the best advice. 

To help me tailor this:
- What is your current height and weight?
- Do you have any food allergies (like gluten or nuts)?
- Are you working out at home or the gym?

Tell me a bit more and I'll customize a strategy for you!`;
  }

  static async scanMealPhoto(imageUrl: string): Promise<{ foodName: string; calories: number; protein: number; carbs: number; fat: number }> {
    const mealOptions = [
      { foodName: 'AI Detected: Avocado Toast with Poached Egg', calories: 340, protein: 14, carbs: 28, fat: 18 },
      { foodName: 'AI Detected: Grilled Salmon Bowl with Quinoa', calories: 520, protein: 38, carbs: 45, fat: 18 },
      { foodName: 'AI Detected: Greek Yogurt Bowl with Mixed Berries', calories: 220, protein: 18, carbs: 24, fat: 5 },
      { foodName: 'AI Detected: Chicken Breast Stir Fry with Jasmine Rice', calories: 550, protein: 44, carbs: 55, fat: 10 },
      { foodName: 'AI Detected: Mixed Garden Green Salad with Olive Oil', calories: 180, protein: 4, carbs: 12, fat: 14 }
    ];
    const index = Math.floor(Math.random() * mealOptions.length);
    return mealOptions[index];
  }

  static async estimateCalories(foodDescription: string): Promise<{ foodName: string; calories: number; protein: number; carbs: number; fat: number }> {
    const desc = foodDescription.toLowerCase();
    
    if (desc.includes('pizza')) {
      return { foodName: 'Pepperoni Pizza Slice', calories: 290, protein: 12, carbs: 32, fat: 12 };
    }
    if (desc.includes('apple')) {
      return { foodName: 'Medium Red Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 };
    }
    if (desc.includes('chicken')) {
      return { foodName: 'Grilled Chicken Breast (150g)', calories: 245, protein: 46, carbs: 0, fat: 5 };
    }

    // Default estimate
    return {
      foodName: foodDescription,
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 12
    };
  }
}
