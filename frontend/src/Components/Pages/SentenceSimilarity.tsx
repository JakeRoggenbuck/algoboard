import React, { useState } from 'react';
import { AlertCircle, ArrowLeftRight, Key } from 'lucide-react';

export default function SentenceSimilarity() {
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };

  const getEmbedding = async (text) => {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            source_sentence: text,
            sentences: [text]
          }
        })
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Hugging Face token.');
      }
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // For feature extraction, we just want the embedding vector
    // Try sending as simple string first
    const simpleResponse = await fetch(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [text]
        })
      }
    );
    
    const simpleResult = await simpleResponse.json();
    return simpleResult[0];
  };

  const compareSentences = async () => {
    if (!sentence1.trim() || !sentence2.trim()) {
      setError('Please enter both sentences');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your Hugging Face API key');
      return;
    }

    setLoading(true);
    setError('');
    setSimilarity(null);

    try {
      const [emb1, emb2] = await Promise.all([
        getEmbedding(sentence1),
        getEmbedding(sentence2)
      ]);

      const sim = cosineSimilarity(emb1, emb2);
      setSimilarity(sim);
    } catch (err) {
      setError(err.message || 'Error computing similarity. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (sim) => {
    if (sim >= 0.8) return 'text-green-600';
    if (sim >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSimilarityLabel = (sim) => {
    if (sim >= 0.8) return 'Very Similar';
    if (sim >= 0.6) return 'Moderately Similar';
    if (sim >= 0.4) return 'Somewhat Similar';
    return 'Not Very Similar';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sentence Similarity Comparator
          </h1>
          <p className="text-gray-600">
            Compare two sentences using LLM embeddings and cosine similarity
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          <div className="flex items-start gap-2">
            <Key className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-yellow-800 mb-1">API Key Required</p>
              <p className="text-yellow-700 mb-2">
                This tool requires a free Hugging Face API key. Get yours at:{' '}
                <a 
                  href="https://huggingface.co/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  huggingface.co/settings/tokens
                </a>
              </p>
              <p className="text-yellow-700 text-xs">
                Create a free account, go to Settings → Access Tokens → New Token (read access is sufficient)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hugging Face API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="hf_..."
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Left Sentence
            </h2>
            <textarea
              value={sentence1}
              onChange={(e) => setSentence1(e.target.value)}
              placeholder="Enter first sentence here..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Right Sentence
            </h2>
            <textarea
              value={sentence2}
              onChange={(e) => setSentence2(e.target.value)}
              placeholder="Enter second sentence here..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={compareSentences}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Computing...
              </>
            ) : (
              <>
                <ArrowLeftRight size={20} />
                Compare Sentences
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {similarity !== null && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Similarity Score
              </h3>
              <div className={`text-6xl font-bold mb-2 ${getSimilarityColor(similarity)}`}>
                {(similarity * 100).toFixed(1)}%
              </div>
              <div className="text-xl text-gray-600 mb-6">
                {getSimilarityLabel(similarity)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${similarity * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-500 text-sm">
                Cosine Similarity: {similarity.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Each sentence is converted into a vector embedding using a transformer model</li>
            <li>• Cosine similarity measures the angle between the two embedding vectors</li>
            <li>• Scores range from 0 (completely different) to 1 (identical meaning)</li>
            <li>• Uses Hugging Face's sentence-transformers/all-MiniLM-L6-v2 model</li>
            <li>• Your API key is stored only in your browser session and never saved</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
