"use client";
import { useEffect, useState } from "react";
import CourseCatalog from "./CourseCatalog";

interface Course {
  id: number;
  title: string;
  description: string;
  durationHours: number;
  difficulty: string;
  isEnrolled: boolean;
}

interface CourseCatalogLogicProps {
  courses: Course[];
}

export default function CourseCatalogLogic({
  courses,
}: CourseCatalogLogicProps) {
  const [difficulty, setDifficulty] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    if (difficulty.trim() === "") {
      setFilteredCourses(courses);
      setIsLoading(false);
    } else {
      const filtered = courses.filter((course) =>
        course.difficulty.toLowerCase().includes(difficulty.toLowerCase())
      );
      setFilteredCourses(filtered);
      setIsLoading(false);
    }
  }, [difficulty, courses]);

  return (
    <CourseCatalog
      setDifficulty={setDifficulty}
      filteredCourses={filteredCourses}
      isLoading={isLoading}
    />
  );
}
