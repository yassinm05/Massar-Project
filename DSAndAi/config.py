class Config:
    """
    Holds all static configuration for the chatbot.
    Separating this into its own file makes the main script cleaner and
    allows for easier management of settings and secrets.
    """
    # --- API and Model Settings ---
    MASAR_API_URL = "http://localhost:5236" 
    GEMINI_API_KEY = "AIzaSyDCUUJMm9qawe_OMr6sxi9AVkgS-0EcU6I"

    GEMINI_MODEL = "gemini-2.0-flash"