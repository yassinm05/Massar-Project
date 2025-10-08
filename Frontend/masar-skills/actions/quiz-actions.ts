'use server'

import { cookies } from 'next/headers';
import { submitAnswer } from '@/lib/quiz';

export async function submitAnswerAction(
  attemptId: number,
  questionId: number,
  optionId: number
) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");
  
  if (!tokenCookie?.value) {
    throw new Error('Not authenticated');
  }

  return await submitAnswer(attemptId, questionId, optionId, tokenCookie.value);
}

