'use client'
import { useEffect, useState } from "react";
import CourseCatalog from "./CourseCatalog";

export default function CourseCatalogLogic({courses}) {
  const [difficulty, setDifficulty] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading,setIsLoading] =useState(false);
  useEffect(() => {
    setIsLoading(true);
      if (difficulty.trim() === "") {
        setFilteredCourses(courses);
        setIsLoading(false);
      } else {
        const filtered = courses.filter(
          (course) =>
            course.difficulty.toLowerCase().includes(difficulty.toLowerCase()) 
        );
        setFilteredCourses(filtered);
        setIsLoading(false);
      }
    }, [difficulty, courses]);
  return <CourseCatalog setDifficulty={setDifficulty} filteredCourses={filteredCourses} isLoading={isLoading} />;
}
