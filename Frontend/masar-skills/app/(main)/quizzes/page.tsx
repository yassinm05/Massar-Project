import { getQuizzes } from "@/lib/user"

export default async function page() {

    const quizzes = await getQuizzes();
  return (
    <div>
      <h1 className="font-bold text-3xl">Available Quizzes</h1>
      <div className="py-10 px-12 flex flex-wrap gap-4">
        <div className="flex flex-col rounded-xl shadow-xl ">
            <div className="">
                <p></p>
                
                    <div key={quizzes.quizId}>
                      {/* Render quiz details here */}
                      <div>{quizzes.quizTitle}</div>
                    </div>
           
            </div>
        </div>
      </div>
    </div>
  )
}
