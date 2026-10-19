# CampusPilot AI 🎓

### Smarter College Discovery. Better-Informed Decisions.

CampusPilot AI is a student-focused platform designed to simplify college discovery and help students explore engineering colleges, compare available options, and make more informed admission decisions.

Built as a project for **GitHub Copilot Dev Days — OSEN Noida 2026**, the project explores how modern web development tools and AI-assisted workflows can help create practical solutions to real student problems.

## ✨ Key Features

- **College Discovery:** Explore engineering college options in one place.
- **College Comparison:** Evaluate different institutions using relevant information.
- **Admission Guidance:** Help students understand their options and make informed choices.
- **Student-Friendly Interface:** Designed to make college research more accessible.
- **AI-Assisted Experience:** Intelligent assistance for college-related queries, if implemented in the current version.

## 🛠️ Tech Stack

- **Frontend:** Add the framework or technologies actually used in this repository.
- **Language:** JavaScript / TypeScript, as applicable.
- **Development Environment:** Visual Studio Code.
- **AI-Assisted Development:** GitHub Copilot.
- **AI Services:** Document the actual provider or model used, if applicable.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   ```

2. Move into the project directory:

   ```bash
   cd CampusPilot-AI
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. To enable Gemini notice parsing, create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey), then create a `.env` file in the project root and add your key:

   ```env
   GEMINI_API_KEY=paste_your_key_here
   ```

   Keep the key private: do not paste it into chat, commit it to GitHub, or put it in frontend code. The `.env` file is ignored by Git. If the app is deployed to a hosting provider, add `GEMINI_API_KEY` to that provider's environment-variable/secrets settings and redeploy; a local `.env` file only applies to your local server.

   Gemini-powered PDF and image uploads are sent to the app's Node server. The deployment must run `server.ts` (or an equivalent backend), not serve the built files as a static-only site, and the key must be configured on that server.

### Notice uploads

- Text files (`.txt`, `.md`) and Word documents (`.docx`) are read as text before extraction.
- PDF and image files (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`) require Gemini mode and are sent to the Node server for analysis.
- Uploads are limited to 8 MB. Legacy `.doc` files are not supported; save them as `.docx` or PDF first.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in your terminal.

## 💻 Development Workflow

GitHub Copilot supports the development workflow for coding, debugging, and iterative refinement. The project is developed and improved through implementation, testing, and feedback.

## 🎯 Project Objective

Choosing an engineering college can involve comparing institutions, understanding admission possibilities, and navigating information from different sources.

CampusPilot AI aims to make this process easier by bringing useful college-related information and decision-support features into a student-focused platform.

## 🔮 Future Improvements

- Expand the available college information.
- Improve college comparison and filtering.
- Enhance accessibility and responsive design.
- Make admission-related information clearer and easier to verify.
- Extend AI-powered assistance, where appropriate.

## 👨‍💻 Author

**Aryan Sharma**  
First-year Computer Science Engineering student  
Galgotias College of Engineering and Technology

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute this project under a particular open-source license.
