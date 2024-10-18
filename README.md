## LinguaStream: A Multilingual Chatbot API

### Project Overview
A real-time, multilingual chatbot capable of translating text between multiple languages within a chat interface. Users can effortlessly switch between languages, fostering seamless global communication.

### Key Features
* **User Authentication:** Secure sign-up and sign-in with JWT.
* **Language Preferences:** Users can customize their preferred languages.
* **Real-time Translation:** Instant translation between supported languages.
* **Chat History:** Access to previous conversations for reference.
* **Gemini Integration:** Enhanced interactivity through Gemini API.

### Technology Stack
* **Backend:** Python 3.8+, FastAPI, PostgreSQL 12+, SQLModel
* **Frontend:** React, TailwindCSS, ShadcnUi, Context API


## Backend

### **Installation and Setup**

follow this steps to set up the project on local enviroment:

1. **Clone or Download the Repository**:

   - **git clone [repository]**
   - **cd [directory name]**
   - **cd backend**
   
2. **Create and Active on virtual enviroment**:
   - **python -m venv venv**
   - **source venv/bin/activate**  
   - **En Windows para activar **`venv\Scripts\activate`****

2. **Install Project Dependencies**:
   
    **pip install -r requirements.txt**
   

## Cloud API Key Setup

To use the translation service, you need to obtain an API key for Google Cloud's Translation API. Follow these steps:

1. Go to **[Google Cloud Console](https://console.cloud.google.com)**.
2. Create a new project and link it to a billing account.
3. Search for "Cloud Translation API" in the API & Services section and enable it.
4. Visit **[Google AI Platform](https://ai.google.dev)** and log in with your Google account.
5. Click on "Get API Key in Google AI Studio".
6. Select the project you created in Google Cloud.
7. Generate an API key for the project.

Once you have the key, update the file `.env.template` rename to `.env` file with your API key and other necessary environment variables:

- **DATABASE_URL:** PostgreSQL database URL
- **SECRET_KEY:** Key for encrypting JWT tokens
- **ALGORITHM:** Encryption algorithm for JWT
- **API_KEY:** Google Cloud API key
- **FRONTEND_URL:** URL for the frontend (usually `http://localhost:5173`)


# **Usages API**

The API will be available for accessing Swagger's interactive documentation, visit **http://localhost:8000/docs/**.

### **Endpoints**
- **Authentication**
   - **`POST /auth/token/:`**  Generates an access token for the user, providing user information.
   - **`POST /auth/users/:`**Registers a new user.
- **Languages:** 
   - **`POST  /languages/seed:`** Populates the database with languages available on the Cloud Translate API.
   - **`GET /languages/all:`** Retrieves all languages supported by Cloud Translate. Requires an access token.

- **Users:** 
  - **`GET /user/me`:**  Gets the currently logged-in user. Requires an access token.
   - **`POST /user/preferences`:** Stores the user's preferred language. Requires an access token.
   - **`GET /user/preferences`:** Retrieves the user's preferred language. Requires an access token.


## Frontend

### **Installation and Setup**

follow this steps to set up the project on local enviroment:

1. **Clone or Download the Repository**:
   - **git clone [repository]**
   - **cd [directory name]**
   - **cd frontend**
2. **Install Project Dependencies**:
   - **npm install**
   - **npm run dev** 
3. **Set env**
   - update the file `.env.template` rename to `.env` necessary environment variables:
   * **VITE_BACKEND_URL:** URL for the backend  in this case ( `http://localhost:8000`)
   * **VITE_BACKEND_URL_WS:** URL for the websocket  in this case ( `ws://localhost:8000`)

## Architecture Overview
### 1. Communication via REST API
The backend and frontend communicate through a RESTful API, where the frontend makes HTTP requests to specific endpoints of the backend.

#### Workflow:
1. **Initialization:** When the application starts, the frontend makes a `GET` request to load initial data (e.g., available languages).
2. **Authentication:** To log in, the frontend sends a `POST /auth/token/`, and the backend returns a JWT token that is stored in the frontend.
3. **Preference Management:** The frontend sends the language preferences via a `POST /user/preferences`.
4. **Data Retrieval:** Data such as chat history is obtained using `GET` requests.

### 2. Real-Time Chat with WebSocket
For the real-time chat functionality, WebSocket is used, allowing for bidirectional communication between the client and the server. This is crucial for sending and receiving messages instantly without needing to refresh the page.

#### WebSocket Flow:
- **Connection:** The frontend establishes a WebSocket connection to the backend using the URL provided in the environment variables (`VITE_BACKEND_URL_WS`).
- **Sending Messages:** When a user sends a message, it is sent via WebSocket to the backend, which processes it and forwards it to all connected users.
- **Receiving Messages:** The frontend listens for incoming messages from the WebSocket and displays them in the user interface in real time.

### 3. Environment Configuration
The URLs for the backend and WebSocket are configured using environment variables to facilitate communication between the two.

## Project Structure for LingueStream

### Root Directory backend
| File/Folder | Description |
|---|---|
| backend | Contains the backend code for the project (server). |
| .env | Configuration file with environment variables (usually hidden). |
| .env.template | Template for the .env file. |
| .gitignore | List of files and folders to be ignored by Git. |
| databases.py | Likely contains database-related logic. |
| main.py | Main execution file for the backend (entry point). |
| requirements.txt | List of project dependencies (Python libraries). |

### backend Directory
| File/Folder | Description |
|---|---|
| api | Contains logic related to the project's APIs. |
| core | Contains the core logic of the project (Chatbot, translate). |
| models | Contains data models for databases. |
| schemas | Contains data schemas for validation. |
| services | Contains reusable services. |
| venv | Python virtual environment to isolate project dependencies. |

### Root Directory
| File/Folder | Description |
|---|---|
| backend | Contains the backend code for the project (server). |
| frontend | Contains the frontend code for the project (user interface). |
| node_modules | Contains project dependencies installed with npm. |
| src | Contains the main source code for the project. |
| .env | Configuration file with environment variables (usually hidden). |
| .env.template | Template for the .env file. |
| .gitignore | List of files and folders to be ignored by Git. |
| components.json | Configuration file for shadcn UI components. |
| eslint.config.js | Configuration for the ESLint linter. |
| index.html | Main HTML file for the frontend. |
| jsconfig.json | Configuration for the JavaScript language. |
| package-lock.json | File generated by npm that stores the exact versions of dependencies. |
| package.json | JSON file that describes the project and its dependencies. |
| postcss.config.js | Configuration for the PostCSS CSS processor. |
| tailwind.config.js | Configuration for the Tailwind CSS framework. |
| vite.config.js | Configuration for the Vite build tool. |
| README.md | File containing information about the project (README). |

### src Directory
| File/Folder | Description |
|---|---|
| Components/ | Contains the code for components. |
| Config/ | Contains the code for an Axios client configuration. |
| Context/ | Contains the code for the Context API for the complementary app. |
| hooks/ | Contains code for custom hooks for authentication. |
| layouts/ | Contains the layouts for each page. |
| libs/ | Contains utility functions for the app. |
| pages/ | Contains the code for the project's pages. |
| App.jsx | Main application file. |
| index.css | Contains project styles. |
| main.jsx | Entry point; the first file that executes when the application starts. |








