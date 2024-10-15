from google.cloud import translate_v2 as translate

def translate_text(target: str, text:str) -> dict:
    translate_client = translate.Client()
    if isinstance(text, bytes):
        text = text.decode("utf-8")
    result = translate_client.translate(text, target_language=target)
    return result["translatedText"] 