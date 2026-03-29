# Pear Media AI Prototype

An AI-powered web application that features creative workflows for text enhancement and image generation. Built for the Pear Media Assignment.

## 🌟 Workflows

1. **Text Input Workflow:**
   - User inputs a basic prompt.
   - The application uses an LLM to enhance the prompt into a rich, descriptive image generation sequence.
   - The user approves the prompt, which is then sent to a Stable Diffusion model to generate a stunning visual.
2. **Image Input Workflow:**
   - User uploads a source image.
   - The application analyzes it using an Image to Text captioning model to extract subjects and style.
   - The application then prompts the diffusion model to generate a new, unique variation of the original image based on those insights.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express, Multer.
- **AI Integration:** Hugging Face Inference APIs (Free tier).
  - Text Enhancement: `mistralai/Mistral-7B-Instruct-v0.2`
  - Image Captioning/Analysis: `Salesforce/blip-image-captioning-large`
  - Image Generation: `stabilityai/stable-diffusion-xl-base-1.0`

---

## 🚀 Setup & Installation (Local Development)

### Prerequisites
- Node.js (v18+)
- A **Hugging Face Account**. Create one at [huggingface.co](https://huggingface.co/), and get your API Key from **Settings > Access Tokens**.

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file and insert your Hugging Face API Token:
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   PORT=5000
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be running at `http://localhost:5173`.

---

## 🌍 Deployment Instructions

### Deploying the Backend on Render
1. Create a new "Web Service" on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In the "Environment Variables" section, add your `HUGGINGFACE_API_KEY`.
5. Deploy! Keep note of the deployed URL across your setup.

### Deploying the Frontend on Netlify
1. Create a new site on [Netlify](https://netlify.com/) and import from GitHub.
2. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. If your backend URL changed, be sure to update the `API_BASE` variable in `frontend/src/components/TextWorkflow.jsx` and `ImageWorkflow.jsx` to point to your new Render backend URL instead of `http://localhost:5000`.
4. Deploy!

## 📸 Project Flow & Usage
1. Open the application.
2. On the **Text to Image** tab, enter a short prompt like "A cat in space" and hit "Enhance". Review the detailed prompt and click "Approve & Generate Image".
3. Switch to the **Image Variations** tab. Select an image file. Click "Analyze Image" to extract its context, then click "Generate Variation" to see a newly imagined perspective based on the original.
