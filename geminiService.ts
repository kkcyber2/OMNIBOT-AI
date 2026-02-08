import { Sentiment, Platform } from "./types";
import { useUsageStore } from "./src/store/usageStore";

export class OmniAIService {
  private static async proxyRequest(operation: string, payload: any) {
    const res = await fetch('http://localhost:3001/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, ...payload })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error: ${res.status} ${text}`);
    }
    return res.json();
  }

  static async analyzeBusinessPriority(content: string): Promise<Sentiment> {
    try {
      const response = await this.proxyRequest('generateContent', {
        model: 'gemini-1.5-flash',
        contents: `Analyze message priority. Categorize as: Sponsor, VIP, Urgent, or Neutral. Return ONE word. Message: "${content}"`,
      });
      const result = (response.text || '').trim() || 'Neutral';
      if (result.includes('Sponsor')) return Sentiment.SPONSOR;
      if (result.includes('VIP')) return Sentiment.VIP;
      if (result.includes('Urgent')) return Sentiment.URGENT;
      return Sentiment.NEUTRAL;
    } catch (error) {
      console.error('[OmniAIService] analyzeBusinessPriority failed:', error);
      return Sentiment.NEUTRAL;
    }
  }

  static async generateAgentResponse(
    message: string,
    customerName: string,
    platform: Platform,
    history: string[] = [],
    useThinking: boolean = false
  ): Promise<{ text: string; action?: string }> {
    try {
      // Use gemini-1.5-pro for advanced reasoning, gemini-1.5-flash for standard responses
      const model = useThinking ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
      const config: any = { temperature: 0.6 }; // Slightly lower for consistency
      
      if (useThinking) {
        // Extended thinking for complex reasoning tasks
        config.maxOutputTokens = 4000;
        // Note: thinkingConfig is experimental and may not work on all models
        // config.thinkingConfig = { thinkingBudgetTokens: 10000 };
      }

      const promptText = `User: ${customerName} on ${platform}\nHistory: ${history.join(' | ')}\nMsg: ${message}`;

      const response = await this.proxyRequest('generateContent', {
        model,
        contents: promptText,
        config: {
          ...config,
          systemInstruction: 'You are OmniBot, a professional business AI agent. Be helpful, concise, and professional.'
        }
      });

      const responseText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm processing your request.";
      
      // ✅ Track conversation usage
      useUsageStore.getState().increment('conversation');
      
      return { text: responseText };
    } catch (error) {
      console.error('[OmniAIService] generateAgentResponse failed:', { 
        customerName, 
        platform, 
        useThinking,
        error: error instanceof Error ? error.message : String(error) 
      });
      return { text: 'Connection error. Please try again.' };
    }
  }

  static async generateImage(prompt: string, aspectRatio: string = '1:1'): Promise<string | null> {
    try {
      const response = await this.proxyRequest('generateContent', {
        model: 'gemini-1.5-flash',
        contents: { parts: [{ text: prompt }] },
        config: { temperature: 0.8 }
      });
      
      // Extract base64 image data from response
      const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
      if (part?.inlineData?.data) {
        // ✅ Track creative usage
        useUsageStore.getState().increment('creative');
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) {
      console.error('[OmniAIService] generateImage failed:', { 
        prompt: prompt.substring(0, 50), 
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
  }

  static async generateVideo(prompt: string): Promise<string | null> {
    // ⚠️ VIDEO GENERATION DISABLED FOR MVP
    // Reason: Veo model is very expensive, has long wait times for results,
    // and requires polling for completion. Re-enable when stable async handling is implemented.
    console.warn('[OmniAIService] Video generation is disabled for MVP. Re-enable in production with proper async handling.');
    return null;
    
    /*
    try {
      // The proxy forwards to the GenAI generateVideos call and returns the operation object.
      const operation = await this.proxyRequest('generateVideos', {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });

      // If the proxy returns a final download URI, return it; otherwise return null.
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      return downloadLink || null;
    } catch (error) {
      console.error('[OmniAIService] generateVideo failed:', { 
        prompt: prompt.substring(0, 50), 
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
    */
  }

  static async textToSpeech(text: string): Promise<ArrayBuffer | null> {
    // ⚠️ TEXT-TO-SPEECH NOT YET STABLE IN PUBLIC API
    // The Gemini API TTS capabilities are still experimental.
    // For production, consider using Google Cloud Text-to-Speech API or external services.
    console.warn('[OmniAIService] Text-to-speech via Gemini API is not yet stable. Consider alternative TTS services.');
    return null;
    
    /*
    try {
      const response = await this.proxyRequest('generateContent', {
        model: 'gemini-1.5-flash',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'default' } } }
        }
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
      return null;
    } catch (error) {
      console.error('[OmniAIService] textToSpeech failed:', {
        textLength: text.length,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
    */
  }
}