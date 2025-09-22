import requests
import json
import os
import google.generativeai as genai
import re
import speech_recognition as sr

MASAR_API_URL = "http://localhost:5236" 
GEMINI_API_KEY = "AIzaSyDCUUJMm9qawe_OMr6sxi9AVkgS-0EcU6I"
genai.configure(api_key=GEMINI_API_KEY)
RESPONSE_API_URL = "http://localhost:5001"

def authenticate_user_and_get_token(email, password):
    """Authenticates a user and returns a JWT token."""
    endpoint = f"{MASAR_API_URL}/api/Auth/login"
    payload = {"email": email, "password": password}
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(endpoint, data=json.dumps(payload), headers=headers, verify=False)
        response.raise_for_status()
        auth_response = response.json()
        if auth_response.get("success") and auth_response.get("token"):
            print("Authentication successful.")
            return auth_response["token"]
        else:
            print(f"Authentication failed: {auth_response.get('message', 'Unknown error')}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Authentication API call failed: {e}")
        return None

def analyze_user_intent_with_gemini(user_input):
    """Analyzes user intent using a Gemini API call."""
    system_prompt = (
        f"The following is a user query for a student information chatbot. "
        f"Determine if the user is asking for their list of courses, their grades, their quiz performance analysis, or if they are simply greeting the chatbot. "
        f"Answer with only 'courses_and_grades' if they are asking about courses or grades. "
        f"Answer with only 'quiz_analysis' if they are asking about their quiz performance or breakdown. "
        f"Answer with only 'greeting' if they are saying hello or a similar welcome. "
        f"Otherwise, answer with 'other'.\n\n"
        f"Examples:\n"
        f"- User: 'Can you show me my final grades from my courses?' -> 'courses_and_grades'\n"
        f"- User: 'How did I do on my last quiz?' -> 'quiz_analysis'\n"
        f"- User: 'Hi there!' -> 'greeting'\n"
        f"- User: 'Hello, how are you?' -> 'greeting'\n"
        f"- User: 'What is the weather like?' -> 'other'\n\n"
        f"User query: '{user_input}'"
    )
    model = genai.GenerativeModel("gemini-2.0-flash", system_instruction=system_prompt)
    response = model.generate_content(user_input)
    intent = response.text.strip().lower().replace("'", "").replace('"', '')
    print(f"Gemini analyzed user intent as: {intent}")
    return intent

def get_student_courses(token):
    """Fetches a student's course information from the Masar Skills API."""
    endpoint = f"{MASAR_API_URL}/api/Student/profile"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.get(endpoint, headers=headers, verify=False)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}

def format_student_info(data):
    """Formats student course and grade information into a readable string."""
    return f"Here is your course information: {json.dumps(data, indent=2)}"

def send_response_to_api(message):
    """Sends the chatbot's final response back to a designated API."""
    print(f"Sending response: {message}")

def get_last_quiz_analysis(token, student_id):
    """
    Fetches the analysis for the student's most recent quiz.
    """
    # This is the new endpoint that doesn't require a quiz ID
    endpoint = f"{MASAR_API_URL}/api/ChatbotQuiz/analyze/last/{student_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.get(endpoint, headers=headers, verify=False)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}

def format_quiz_analysis(analysis_data):
    """
    Formats the quiz analysis JSON into a conversational, natural-language response.
    """
    overall_score = analysis_data.get("overallScore", 0)
    strengths = analysis_data.get("strengths", [])
    weaknesses = analysis_data.get("areasForImprovement", [])
    
    response_parts = [f"I have analyzed your quiz results. Your overall score was {overall_score:.2f}%."]
    
    if strengths:
        strengths_str = ", ".join(strengths)
        response_parts.append(f"Your strengths are in: {strengths_str}.")
    
    if weaknesses:
        weaknesses_str = ", ".join(weaknesses)
        response_parts.append(f"You might want to focus on improving your knowledge in: {weaknesses_str}.")
    
    return " ".join(response_parts)

def get_voice_input():
    """Listens for a user's voice and converts it to text."""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1
        audio = r.listen(source)
    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-US')
        print(f"User said: {query}")
        return query
    except sr.UnknownValueError:
        return "Sorry, I couldn't understand your audio. Please try again."
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}"

def main_chatbot_flow(user_query):
    """The main entry point for the chatbot's logic."""
    print(f"Analyzing user query: '{user_query}'")
    
    # Authenticate the user (using dummy credentials for this example)
    token = authenticate_user_and_get_token("mohamed.ali@example.com", "Student@123")
    
    if not token:
        return "I'm sorry, I'm unable to authenticate you at this time. Please try again."

    intent = analyze_user_intent_with_gemini(user_query)
    
    if intent == "quiz_analysis":
        print("Intent recognized as 'quiz_analysis'. Fetching quiz data...")
        
        # In a real application, the student_id would be retrieved from the
        # user's session or the JWT token after a successful login.
        # For this example, we'll keep the hardcoded value.
        student_id = 1
        
        # Now, call the new function to get the last quiz analysis
        analysis = get_last_quiz_analysis(token, student_id)
        
        if analysis["success"]:
            print("Quiz analysis data retrieved successfully.")
            formatted_response = format_quiz_analysis(analysis["data"])
        else:
            print(f"Failed to get quiz analysis data: {analysis['error']}")
            formatted_response = f"I'm sorry, I couldn't get your quiz analysis. {analysis['error']}"
    elif intent == "greeting":
        print("Intent recognized as 'greeting'. Providing a welcome response.")
        formatted_response = "Hello! I am your student assistant. I can help with questions about your courses, grades, or quiz performance. How can I help you today?"
    elif intent == "courses_and_grades":
        print("Intent recognized as 'courses_and_grades'. Fetching student data...")
        
        result = get_student_courses(token)
        
        if result["success"]:
            print("Student data retrieved successfully.")
            formatted_response = format_student_info(result["data"])
        else:
            print(f"Failed to get student data: {result['error']}")
            formatted_response = f"I'm sorry, I couldn't get your course information. {result['error']}"
    else:
        print("Intent not related to courses or grades. Providing a general response.")
        formatted_response = "I can help with questions about your courses and grades. Please provide a clear request."
        
    print("\nSending final response to the backend API...")
    send_response_to_api(formatted_response)
    
    return formatted_response

if __name__ == '__main__':
    print("--- Starting Chatbot with Text Input ---")
    
    # Change this line to test different queries
    test_query = "هل يمكنك مساعدتي في معرفة أدائي في الاختبارات؟"
    
    main_chatbot_flow(user_query=test_query)