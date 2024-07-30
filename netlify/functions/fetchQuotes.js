
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'Give me 10 positive motivation quotes.' }],
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: response.statusText })
    };
  }

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
