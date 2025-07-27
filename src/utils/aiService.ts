const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AIResponse {
  message: string;
  isRedFlag: boolean;
  redFlags: string[];
}

const RED_FLAG_KEYWORDS = [
  'chest pain', 'difficulty breathing', 'severe headache', 'sudden weakness',
  'unconscious', 'seizure', 'severe bleeding', 'high fever', 'suicidal',
  'can\'t breathe', 'heart attack', 'stroke', 'overdose', 'severe pain',
  'allergic reaction', 'swelling face', 'difficulty swallowing', 'confusion',
  'vomiting blood', 'severe abdominal pain', 'loss of consciousness'
];

export async function askAI(message: string, userContext?: any): Promise<AIResponse> {
  try {
    const systemPrompt = `You are Arogya Sahayak AI, a helpful medical assistant. Provide accurate, empathetic medical information while always recommending consulting healthcare professionals for serious concerns. 

IMPORTANT: If the user mentions any serious symptoms like chest pain, difficulty breathing, severe headache, sudden weakness, seizures, high fever, suicidal thoughts, or other emergency symptoms, flag this as a red flag and recommend immediate medical attention.

User context: ${userContext ? JSON.stringify(userContext) : 'No additional context'}

Please respond helpfully and identify any red flag symptoms.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Arogya Sahayak'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';

    // Check for red flags
    const lowerMessage = message.toLowerCase();
    const detectedRedFlags = RED_FLAG_KEYWORDS.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    const isRedFlag = detectedRedFlags.length > 0 || 
      lowerMessage.includes('emergency') ||
      lowerMessage.includes('urgent') ||
      lowerMessage.includes('severe') ||
      aiMessage.toLowerCase().includes('emergency') ||
      aiMessage.toLowerCase().includes('seek immediate');

    return {
      message: aiMessage,
      isRedFlag,
      redFlags: detectedRedFlags
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      message: 'I apologize, but I\'m currently unable to respond. Please consult with your healthcare provider if you have medical concerns.',
      isRedFlag: false,
      redFlags: []
    };
  }
}

export async function sendEmergencyAlert(
  emergencyContact: string, 
  emergencyContactName: string, 
  patientName: string, 
  symptoms: string[]
): Promise<void> {
  // In a real application, this would send SMS/email
  console.log('Emergency Alert:', {
    to: emergencyContact,
    contactName: emergencyContactName,
    patient: patientName,
    symptoms
  });
  
  // Simulate sending notification
  alert(`Emergency alert would be sent to ${emergencyContactName} (${emergencyContact}) about ${patientName}'s symptoms: ${symptoms.join(', ')}`);
}
