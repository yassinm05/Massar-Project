import requests
import json
import google.generativeai as genai
from langdetect import detect, LangDetectException
import re
import speech_recognition as sr

# Import the Config class from the separate config.py file.
from config import Config

# --- 1. INITIALIZATION ---
# Configure services using settings from the Config class.
genai.configure(api_key=Config.GEMINI_API_KEY)
api_session = requests.Session()


# --- 2. LANGUAGE AND TRANSLATIONS ---
translations = {
    "en": {
        "auth_error": "I'm sorry, I'm unable to authenticate you. Please try again.",
        "student_id_required": "I'm sorry, this action is only available for student accounts.",
        "intent_greeting": "Hello! I am the Masar Chatbot, your nursing student assistant. I can help with academics, course recommendations, or general medical questions.",
        "intent_other": "As the Masar Chatbot, I can assist with academic records, course recommendations, and general medical questions. How can I help?",
        "fetch_data_error": "I'm sorry, I couldn't retrieve your information. Error: {error}",
        "student_info_format": "Here is your course information:\n{data}",
        "quiz_analysis_format": "I have analyzed your last quiz. Your score was {score:.2f}%. Strengths: {strengths}. Areas to improve: {weaknesses}.",
        "ask_for_interest": "Of course! What nursing topics are you interested in? E.g., 'pediatrics' or 'pharmacology'.",
        "no_courses_found": "I couldn't find any courses matching your interest in '{interest}'.",
        "recommendation_intro": "Based on your interest in '{interest}', here are some courses you might like:",
        "recommendation_item": "- {title}: {description}",
        "course_fetch_error": "I'm sorry, I couldn't fetch the course catalog right now.",
        "listening": "I'm listening...",
        "recognizing": "Recognizing your voice...",
        "voice_unrecognized": "Sorry, I couldn't understand the audio. Please try speaking clearly.",
        "voice_request_error": "Could not request results from the speech recognition service; {error}",
        "medical_disclaimer": "Disclaimer: This information is for educational purposes only. Always consult a qualified healthcare professional for medical advice."
    },
    "ar": {
        "auth_error": "عذراً، لا يمكنني مصادقتك في الوقت الحالي. يرجى المحاولة مرة أخرى.",
        "student_id_required": "عذراً، هذا الإجراء متاح فقط لحسابات الطلاب.",
        "intent_greeting": "مرحباً! أنا مساعدك الرقمي 'مسار'. بصفتي مساعد طالب تمريض، يمكنني المساعدة في الأمور الأكاديمية، ترشيح الدورات، أو الإجابة على أسئلة طبية عامة.",
        "intent_other": "بصفتي مساعدك الرقمي 'مسار'، يمكنني المساعدة في السجلات الأكاديمية، ترشيح الدورات، والأسئلة الطبية العامة. كيف يمكنني مساعدتك؟",
        "fetch_data_error": "عذراً، لم أتمكن من استرداد معلوماتك. الخطأ: {error}",
        "student_info_format": "إليك معلومات دورتك:\n{data}",
        "quiz_analysis_format": "لقد حللت اختبارك الأخير. نتيجتك كانت {score:.2f}%. نقاط القوة: {strengths}. الجوانب التي تحتاج إلى تحسين: {weaknesses}.",
        "ask_for_interest": "بالطبع! ما هي مواضيع التمريض التي تهمك؟ على سبيل المثال، 'طب الأطفال' أو 'علم الأدوية'.",
        "no_courses_found": "لم أتمكن من العثور على أي دورات تطابق اهتمامك بـ '{interest}'.",
        "recommendation_intro": "بناءً على اهتمامك بـ '{interest}'، إليك بعض الدورات التي قد تعجبك:",
        "recommendation_item": "- {title}: {description}",
        "course_fetch_error": "عذراً، لم أتمكن من جلب قائمة الدورات في الوقت الحالي.",
        "listening": "أنا أستمع الآن...",
        "recognizing": "جاري التعرف على صوتك...",
        "voice_unrecognized": "عذراً، لم أتمكن من فهم الصوت. يرجى محاولة التحدث بوضوح.",
        "voice_request_error": "لم أتمكن من طلب النتائج من خدمة التعرف على الكلام؛ {error}",
        "medical_disclaimer": "إخلاء مسؤولية: هذه المعلومات للأغراض التعليمية فقط. استشر دائمًا أخصائي رعاية صحية مؤهل للحصول على المشورة الطبية."
    }
}


def get_text(lang, key, **kwargs):
    return translations.get(lang, translations["en"]).get(key, key).format(**kwargs)

def detect_language(text):
    try:
        lang = detect(text)
        return "ar" if lang == "ar" else "en"
    except LangDetectException:
        return "en"

# --- 3. API COMMUNICATION ---


def get_data_from_api(endpoint, token):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = api_session.get(endpoint, headers=headers, timeout=10)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.HTTPError as http_err:
        return {"success": False, "error": f"HTTP error occurred: {http_err}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"API call failed: {e}"}


# --- 4. AI, VOICE, AND FORMATTING LOGIC ---
# ... (This entire section remains unchanged) ...
def get_voice_input(lang='en'):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print(get_text(lang, "listening"))
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.listen(source)
    print(get_text(lang, "recognizing"))
    try:
        query = recognizer.recognize_google(audio, language='en-US')
        print(f"Recognized as English: '{query}'")
        return query
    except sr.UnknownValueError:
        try:
            query = recognizer.recognize_google(audio, language='ar-EG')
            print(f"Recognized as Arabic: '{query}'")
            return query
        except sr.UnknownValueError:
            return get_text(lang, "voice_unrecognized")
    except sr.RequestError as e:
        return get_text(lang, "voice_request_error", error=e)

def analyze_user_intent_with_gemini(user_input, lang):
    language_name = "Arabic" if lang == 'ar' else "English"
    system_prompt = (
        "You are the Masar Chatbot, an expert AI assistant for nursing students. "
    f"The user's query is in {language_name}. Classify the intent into one of the following: "
    # Make the descriptions more distinct
    "'courses_and_grades': Use for questions about a student's OWN enrolled courses, grades, or academic progress. "
    "'quiz_analysis': For analyzing a student's quiz results. "
    "'course_recommendation': Use for general questions asking to find, search, or see ALL available courses in the catalog. Also use this when the user asks for a recommendation on a specific topic. "
    "'medical_question': For any health, drug, or symptom-related query. "
    "'greeting': For simple hellos and greetings. "
    "'other': If it doesn't fit any other category. "
    "Respond ONLY with a JSON object: {\"intent\": \"<intent_name>\", \"interest\": \"<extracted_topic>\"}. "
    "Extract an interest topic only for recommendations. Otherwise, interest is null."
    )
    model = genai.GenerativeModel(Config.GEMINI_MODEL, system_instruction=system_prompt)
    response = model.generate_content(user_input)
    try:
        clean_response = response.text.strip().replace("```json", "").replace("```", "")
        data = json.loads(clean_response)
        print(f"Masar Chatbot analysis: {data}")
        return data.get("intent", "other"), data.get("interest")
    except (json.JSONDecodeError, AttributeError):
        return "other", None

def get_medical_answer(query, lang):
    disclaimer = get_text(lang, 'medical_disclaimer')
    system_prompt = (
        "You are the Masar Chatbot, a helpful AI assistant for nursing students. Provide clear, accurate, and concise medical information for educational purposes. You are not a doctor. "
        f"Start every single response with the following disclaimer, translated to the user's language ({lang}): '{disclaimer}'"
        "\n\nAfter the disclaimer, answer the user's question."
    )
    model = genai.GenerativeModel(Config.GEMINI_MODEL, system_instruction=system_prompt)
    response = model.generate_content(query)
    return response.text.strip()

def format_quiz_analysis(analysis_data, lang):
    score = analysis_data.get("overallScore", 0)
    strengths = ", ".join(analysis_data.get("strengths", [])) or "N/A"
    weaknesses = ", ".join(analysis_data.get("areasForImprovement", [])) or "N/A"
    return get_text(lang, "quiz_analysis_format", score=score, strengths=strengths, weaknesses=weaknesses)

def format_student_info(data, lang):
    formatted_data = json.dumps(data, indent=2, ensure_ascii=False)
    return get_text(lang, "student_info_format", data=formatted_data)

def format_course_recommendations(courses, interest, lang):
    if not courses:
        return get_text(lang, "no_courses_found", interest=interest)
    response_parts = [get_text(lang, "recommendation_intro", interest=interest)]
    for course in courses:
        response_parts.append(
            get_text(lang, "recommendation_item", title=course.get('title'), description=course.get('description'))
        )
    return "\n".join(response_parts)

# --- 5. MAIN CHATBOT FLOW ---
def main_chatbot_flow(user_query, token, student_id=None):
    lang = detect_language(user_query)

    # The token is now passed directly, so we just check if it exists.
    if not token:
        return get_text(lang, "auth_error")

    intent, interest = analyze_user_intent_with_gemini(user_query, lang)

    if intent == "medical_question":
        return get_medical_answer(user_query, lang)

    # Check if the intent requires a student ID and if one was provided.
    student_specific_intents = ["quiz_analysis", "courses_and_grades"]
    if intent in student_specific_intents and not student_id:
        return get_text(lang, "student_id_required")

    if intent == "greeting":
        return get_text(lang, "intent_greeting")
    
    elif intent == "quiz_analysis":
        endpoint = f"{Config.MASAR_API_URL}/api/ChatbotQuiz/analyze/last/{student_id}"
        result = get_data_from_api(endpoint, token)
        return format_quiz_analysis(result["data"], lang) if result["success"] else get_text(lang, "fetch_data_error", error=result.get('error', ''))
            
    elif intent == "courses_and_grades":
        endpoint = f"{Config.MASAR_API_URL}/api/Courses"
        result = get_data_from_api(endpoint, token)
        return format_student_info(result["data"], lang) if result["success"] else get_text(lang, "fetch_data_error", error=result.get('error', ''))

    elif intent == "course_recommendation":
        if not interest:
            return get_text(lang, "ask_for_interest")
        else:
            endpoint = f"{Config.MASAR_API_URL}/api/Courses"
            result = get_data_from_api(endpoint, token)
            if result["success"]:
                keywords = re.findall(r'\w+', interest.lower())
                recommended_courses = [c for c in result["data"] if any(k in c.get('title','').lower() or k in c.get('description','').lower() for k in keywords)]
                return format_course_recommendations(recommended_courses, interest, lang)
            else:
                return get_text(lang, "course_fetch_error")
    else:
        return get_text(lang, "intent_other")
    

if __name__ == '__main__':
    print("--- Starting Chatbot with Text Input ---")
    
    test_query = "Hello"
    
    # For testing, you must now provide a valid token from your backend.
    # This block is for testing the script directly and is NOT used by the Flask API.
    test_token = "your_valid_jwt_token_from_masar_backend" 
    test_student_id = 1 # Use a real student ID for testing student-specific intents

    final_response = main_chatbot_flow(
        user_query=test_query, 
        token=test_token, 
        student_id=test_student_id
    )
    print("\nFinal Chatbot Response:")
    print(final_response)