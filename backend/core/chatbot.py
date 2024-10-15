import google.generativeai as genai
import os
from dotenv import load_dotenv
from .translate import translate_text

load_dotenv()


def chatbot_ai(user_input: str, target_language: str):
    try:
        # Configurar la API de Generative pornemos el api_key y seleccionamos el modelo 
        genai.configure(api_key=os.environ["API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        # Generar contenido usando el modelo proporcionado
        response = model.generate_content(
            user_input,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                stop_sequences=["x"],
                max_output_tokens=50,
                temperature=0.1,
            ),
        )
        # Traducir la respuesta generada al lenguaje objetivo
        translated_response = translate_text(target_language, response.text)
        return translated_response
    except Exception as e:
        return f"Erros processing message: {str(e)}"
