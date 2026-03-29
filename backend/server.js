require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Helper to make HF API calls
const hfRequest = async (model, data, contentType = 'application/json', responseType = 'json') => {
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("Hugging Face API key not configured");
  
  return axios.post(`https://api-inference.huggingface.co/models/${model}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType
    },
    responseType
  });
};

app.post('/api/text/enhance', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Use Mistral-7B-Instruct for text enhancement
    const model = 'mistralai/Mistral-7B-Instruct-v0.2';
    const systemPrompt = "You are a prompt engineering expert. Enhance the following user prompt for an image generation AI. Add descriptive keywords for style, lighting, and composition to make it visually stunning. Return ONLY the enhanced prompt string without any conversational filler or quotes.";
    
    // Format input for Mistral instruct
    const inputs = `<s>[INST] ${systemPrompt}\n\nUser prompt: ${prompt} [/INST]`;

    const response = await hfRequest(model, { inputs, parameters: { max_new_tokens: 100, temperature: 0.7 } });
    
    // Extract generated text
    let enhanced = response.data[0].generated_text.replace(inputs, '').trim();
    
    res.json({ enhancedPrompt: enhanced });
  } catch (error) {
    console.error('Enhance error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to enhance prompt.' });
  }
});

app.post('/api/text/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const model = 'stabilityai/stable-diffusion-xl-base-1.0';
    const response = await hfRequest(model, { inputs: prompt }, 'application/json', 'arraybuffer');
    
    // Convert arraybuffer to base64 for the frontend
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    
    res.json({ image: imageSrc });
  } catch (error) {
    console.error('Generate error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image.' });
  }
});

app.post('/api/image/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    const imagePath = req.file.path;
    const fileData = fs.readFileSync(imagePath);
    
    // Use BLIP for image captioning
    const model = 'Salesforce/blip-image-captioning-large';
    const response = await hfRequest(model, fileData, 'application/octet-stream');
    
    const caption = response.data[0]?.generated_text || 'No caption generated';
    
    // Clean up file
    fs.unlinkSync(imagePath);
    
    res.json({ caption });
  } catch (error) {
    console.error('Analyze error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze image.' });
  }
});

app.post('/api/image/variations', async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) return res.status(400).json({ error: 'Caption is required' });

    // Since HF free tier doesn't easily support img2img, we use the generated caption 
    // to prompt the SDXL model to create a new variation. We will slightly modify the caption.
    const variationPrompt = `A high quality variation of: ${caption}. Cinematic lighting, highly detailed.`;
    
    const model = 'stabilityai/stable-diffusion-xl-base-1.0';
    const response = await hfRequest(model, { inputs: variationPrompt }, 'application/json', 'arraybuffer');
    
    // Convert arraybuffer to base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    
    res.json({ image: imageSrc });
  } catch (error) {
    console.error('Variation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate variation.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
