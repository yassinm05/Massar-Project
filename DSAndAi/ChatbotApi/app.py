from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr

# Import the main function from your chatbot logic file
from chatbot_logic import main_chatbot_flow

# Create an instance of the Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# --- API ENDPOINTS ---

@app.route("/")
def index():
    return "Masar Chatbot API is running!"

@app.route("/api/chat", methods=['POST'])
def chat():
    # 1. Get the JWT from the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization header with Bearer token is required"}), 401

    token = auth_header.split(' ')[1]

    # 2. Get the JSON data from the request body
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Missing 'query' in request body"}), 400

    # 3. Extract query and optional student_id
    user_query = data['query']
    student_id = data.get('studentId') # Use .get() for optional fields

    # 4. Call the updated chatbot logic
    bot_response = main_chatbot_flow(
        user_query=user_query,
        token=token,
        student_id=student_id
    )
    return jsonify({"response": bot_response})


@app.route("/api/transcribe", methods=['POST'])
def transcribe_audio():
    
    # The frontend calls this first, then uses the resulting text to call /api/chat.
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file found in the request"}), 400

    audio_file = request.files['audio']
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data, language='en-US')
            lang = 'en'
            return jsonify({"transcribed_text": text, "language": lang})
        except sr.UnknownValueError:
            try:
                text = recognizer.recognize_google(audio_data, language='ar-EG')
                lang = 'ar'
                return jsonify({"transcribed_text": text, "language": lang})
            except sr.UnknownValueError:
                return jsonify({"error": "Could not understand the audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results; {e}"}), 503
    except Exception as e:
        return jsonify({"error": f"Error processing audio file: {e}"}), 500


# --- RUN THE APP ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)