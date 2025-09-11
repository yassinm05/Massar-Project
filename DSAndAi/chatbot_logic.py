import requests
import json
import os
import google.generativeai as genai

MASAR_API_URL = "https://localhost:7294" 

GEMINI_API_KEY = "AIzaSyDCUUJMm9qawe_OMr6sxi9AVkgS-0EcU6I"

genai.configure(api_key=GEMINI_API_KEY)

RESPONSE_API_URL = "http://localhost:5001"

def authenticate_user_and_get_token(email, password):
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
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = (
        f"The following is a user query for a student information chatbot. "
        f"Determine if the user is asking for their list of courses or their grades. "
        f"Answer with only 'courses_and_grades' if the intent matches, otherwise, answer with 'other'.\n\n"
        f"User query: '{user_input}'"
    )
    
    try:
        response = model.generate_content(prompt)
        intent = response.text.strip().lower()
        print(f"AI analyzed intent: {intent}")
        return "courses_and_grades" in intent
        
    except Exception as e:
        print(f"AI call failed: {e}")
        return False

def get_student_courses(auth_token):
    endpoint = f"{MASAR_API_URL}/api/enrollment/my-courses"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Accept": "application/json"
    }

    try:
        response = requests.get(endpoint, headers=headers, verify=False)
        response.raise_for_status()

        enrollments = response.json()
        
        courses_info = []
        for enrollment in enrollments:
            course_title = enrollment.get("courseTitle", "N/A")
            progress = enrollment.get("progressPercentage", 0)
            final_grade = enrollment.get("finalGrade", "N/A")
            
            courses_info.append({
                "title": course_title,
                "progress": f"{progress}%",
                "grade": final_grade if final_grade is not None else "N/A"
            })
            
        return {"success": True, "data": courses_info}

    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Failed to retrieve data from API: {e}"}

def format_student_info(courses_data):
    if not courses_data:
        return "You are not currently enrolled in any courses."

    response_text = "Here are your enrolled courses and grades:\n"
    for course in courses_data:
        response_text += (
            f"\n- **Course:** {course['title']}\n"
            f"  - **Progress:** {course['progress']}\n"
            f"  - **Final Grade:** {course['grade']}\n"
        )
    return response_text

def send_response_to_api(message):
    endpoint = f"{RESPONSE_API_URL}/api/chatbot-response"
    payload = {"message": message}
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(endpoint, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        print("\nSuccessfully sent the response to the backend API.")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"\nFailed to send response to backend API: {e}")
        return {"status": "error", "message": str(e)}

def main_chatbot_flow(user_input):
    print(f"User Input: '{user_input}'")
    
    lowered_input = user_input.lower()
    if "who are you" in lowered_input or "what is your name" in lowered_input:
        formatted_response = "My name is Masar 1.0."
        print(f"Responding directly: {formatted_response}")
        send_response_to_api(formatted_response)
        return formatted_response

    token = authenticate_user_and_get_token("mohamed.ali@example.com", "Student@123")
    if not token:
        print("Could not authenticate. Aborting.")
        formatted_response = "I am unable to authenticate with the system. Please try again later."
        send_response_to_api(formatted_response)
        return formatted_response
    
    if analyze_user_intent_with_gemini(user_input):
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
    user_query_1 = "Can you show me my final grades from my courses?"
    user_query_2 = "Hello, how are you today?"
    user_query_3 = "Who are you?"
    
    print("--- Chatbot Test 1 ---")
    response_1 = main_chatbot_flow(user_query_1)
    print("\nFinal Chatbot Output:")
    print(response_1)
    
    print("\n--- Chatbot Test 2 ---")
    response_2 = main_chatbot_flow(user_query_2)
    print("\nFinal Chatbot Output:")
    print(response_2)

    print("\n--- Chatbot Test 3 ---")
    response_3 = main_chatbot_flow(user_query_3)
    print("\nFinal Chatbot Output:")
    print(response_3)
