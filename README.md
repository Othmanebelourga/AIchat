<<<<<<< HEAD
# AIchat
=======
# AI Chat Application

A modern chat interface for interacting with Mistral AI language models.

## Features

- Clean, modern UI with light and dark mode support
- Real-time streaming responses
- File attachment support
- Multiple Mistral AI model options
- Responsive design for mobile and desktop
- IDE-style code syntax highlighting

## Code Display Example

The application automatically formats code blocks with syntax highlighting:

```javascript
// Example JavaScript code
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

```python
# Example Python code
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

print(factorial(5))  # Output: 120
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

4. Get a Mistral API key from [Mistral AI Console](https://console.mistral.ai/) and add it to your `.env.local` file:

```
MISTRAL_API_KEY=your_mistral_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Models

- Mistral Tiny - Fast and efficient for simple tasks
- Mistral Small - Good balance of performance and quality
- Mistral Medium - Higher quality for more complex tasks
- Mistral Large - Best quality for advanced use cases

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Your Mistral AI API key (required) |

## License

MIT
>>>>>>> be053b2 (Initial commit)
