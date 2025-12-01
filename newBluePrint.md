# Lesson JSON Structure Template

This is the final JSON structure template for building interactive lessons with theory → snippet → editor → quiz flow.

---

## Template

```json
{
  "title": "Lesson Title",
  "description": "Short intro about what this lesson teaches.",
  
  "steps": [
    {
      "type": "theory",
      "content": "Friendly explanation of the concept written in simple language."
    },
    {
      "type": "snippet",
      "language": "javascript",
      "code": "console.log(1);"
    },
    {
      "type": "editor",
      "startingCode": "console.log(1);",
      "instructions": "Ask the learner to run the code or try something simple.",
      "hint": "Optional hint for beginners."
    },
    {
      "type": "theory",
      "content": "More explanation after running code."
    },
    {
      "type": "snippet",
      "language": "javascript",
      "code": "let x;\nconsole.log(x);"
    },
    {
      "type": "editor",
      "startingCode": "let x;\nconsole.log(x);",
      "instructions": "Run the code to see the output.",
      "hint": "Optional."
    }
  ],

  "quiz": [
    {
      "question": "What will be the output of this code?",
      "code": "let num;\nconsole.log(num);",
      "options": ["0", "undefined", "error"],
      "answerIndex": 1
    },
    {
      "question": "What is the value of num after this code?",
      "code": "let num = 0;\nnum = 2;\nconsole.log(num);",
      "options": ["0", "2", "undefined"],
      "answerIndex": 1
    }
  ]
}
```

---

## Field Explanation

### title
Name of the lesson.

### description
Short summary describing what the lesson covers.

### steps[]
A list of steps shown one by one. Each step has a "type":

- `theory`: A block of explanation.
- `snippet`: Read-only code preview.
- `editor`: Interactive editor + instructions.

### quiz[]
A list of multiple-choice questions with:

- question: text
- code: optional code block
- options: array of answers
- answerIndex: index of correct option
