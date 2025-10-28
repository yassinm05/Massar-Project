import { verifyAuth } from "@/lib/auth";
import { getResult } from "@/lib/quiz";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import React from "react";

import QuizResultClient from "@/components/quizzes/QuizResultClient";

export default async function page({ params }: { params: { id: number } }) {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const cookieStore = await cookies(); // wait for it
  const tokenCookie = cookieStore.get("auth-token");
  if (!tokenCookie?.value) {
    return redirect("/");
  }
  const { id } = params;
  const examResult = await getResult(id, tokenCookie.value);
  return <QuizResultClient examResult={examResult} />;
}
