import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found. Please ensure it's set in your .env file.")

app = Flask(__name__)

@app.route("/generate", methods=['POST'])
def generate_from_template():
    """
    This endpoint receives a context and a prompt, then generates a response from Gemini.
    """
    data = request.get_json()

    if not data or 'context' not in data or 'prompt' not in data:
        return jsonify({"error": "Request body must contain both 'context' and 'prompt' keys."}), 400

    context = data['context']
    prompt = data['prompt']

    print(f"Received request for prompt: {prompt}")

    template_prompt = f"""
    **Task:** Answer the following question based only on the provided context. Be precise and concise.

    **Context:**
    ---
    {context}
    ---

    **Question:**
    {prompt}

    **Answer:**
    """

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
        
        response = llm.invoke(template_prompt)

        return jsonify({"answer": response.content})

    except Exception as e:
        print(f"An error occurred while communicating with Gemini: {e}")
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)