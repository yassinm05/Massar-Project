from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/chatbot-response', methods=['POST'])
def receive_chatbot_response():
    """
    Receives the final formatted response from the chatbot and processes it.
    
    A backend developer can use this endpoint as a reference for their project.
    """
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request body must be JSON"}), 400

    data = request.get_json()
    message = data.get("message")
    
    if not message:
        return jsonify({"status": "error", "message": "Missing 'message' field in JSON"}), 400
    
    # Here save this message to a database or forward it to the frontend for display.
    print("\n--- Received Final Chatbot Response ---")
    print(message)
    print("---------------------------------------")
    
    return jsonify({"status": "success", "message": "Response received and processed."}), 200

if __name__ == '__main__':
    # Run this API on a different port to avoid conflicts with your C# project.
    # The chatbot_logic.py script sends its response to this port.
    app.run(port=5001, debug=True)
