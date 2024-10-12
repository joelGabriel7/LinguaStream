from pydantic import BaseModel


class LanguagesResponse(BaseModel):
    id: int
    language_code: str
    name: str

    class Meta:
        from_attributes = True
