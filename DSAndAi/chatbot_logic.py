import requests
import json
import os
import google.generativeai as genai
import re
import speech_recognition as sr

MASAR_API_URL = "https://localhost:7294" 


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
        f"Determine if the user is asking for their list of courses, their grades, or their quiz performance analysis. "
        f"Answer with only 'courses_and_grades' if they are asking about courses or grades. "
        f"Answer with only 'quiz_analysis' if they are asking about their quiz performance or breakdown. "
        f"Otherwise, answer with 'other'.\n\n"
        f"Examples:\n"
        f"- User: 'Can you show me my final grades from my courses?' -> 'courses_and_grades'\n"
        f"- User: 'How did I do on my last quiz?' -> 'quiz_analysis'\n"
        f"- User: 'What were my weak points in the first aid quiz?' -> 'quiz_analysis'\n"
        f"- User: 'Tell me about my performance on the recent exam.' -> 'quiz_analysis'\n"
        f"- User: 'What is the weather like?' -> 'other'\n\n"
        f"User query: '{user_input}'"
    )
    model = genai.GenerativeModel("gemini-1.5-pro-latest", system_instruction=system_prompt)
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
    # Dummy implementation for formatting
    return f"Here is your course information: {json.dumps(data, indent=2)}"

def send_response_to_api(message):
    """Sends the chatbot's final response back to a designated API."""
    # Dummy function to simulate sending a response
    print(f"Sending response: {message}")

def get_quiz_analysis(token, student_id, quiz_id):
    """
    Fetches the quiz analysis from the new API endpoint.
    
    Args:
        token (str): The user's JWT token for authentication.
        student_id (int): The ID of the student.
        quiz_id (int): The ID of the quiz.
    
    Returns:
        dict: A dictionary with 'success' and 'data' or 'error'.
    """
    endpoint = f"{MASAR_API_URL}/api/ChatbotQuiz/analyze/{student_id}/{quiz_id}"
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
    
    Args:
        analysis_data (dict): The JSON response from the quiz analysis API.
    
    Returns:
        str: A formatted, conversational response string.
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
    """
    Listens for a user's voice and converts it to text.
    
    Returns:
        str: The transcribed text, or an error message.
    """
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

def main_chatbot_flow(user_query=None):
    """The main entry point for the chatbot's logic."""
    if user_query is None:
        user_query = get_voice_input()
        if user_query.startswith("Sorry,"):
            print(user_query)
            return
            
    print(f"Analyzing user query: '{user_query}'")
    
    # Authenticate the user (using dummy credentials for this example)
    # TODO: Replace with dynamic user data
    token = authenticate_user_and_get_token("mohamed.ali@example.com", "Student@123")
    
    if not token:
        return "I'm sorry, I'm unable to authenticate you at this time. Please try again."

    intent = analyze_user_intent_with_gemini(user_query)
    
    # New logic for quiz analysis
    if intent == "quiz_analysis":
        print("Intent recognized as 'quiz_analysis'. Fetching quiz data...")
        
        # TODO: Dynamically extract student_id and quiz_id from the user's context or query.
        # For this example, we use hardcoded values.
        student_id = 1
        quiz_id = 1 
        
        analysis = get_quiz_analysis(token, student_id, quiz_id)
        
        if analysis["success"]:
            print("Quiz analysis data retrieved successfully.")
            formatted_response = format_quiz_analysis(analysis["data"])
        else:
            print(f"Failed to get quiz analysis data: {analysis['error']}")
            formatted_response = f"I'm sorry, I couldn't get your quiz analysis. {analysis['error']}"

    # Existing logic for courses and grades
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
    # When running this, make sure your microphone is enabled.
    # The script will wait for you to speak.
    print("--- Starting Voice-Enabled Chatbot ---")
    main_chatbot_flow()
