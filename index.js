const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/tasks', express.static('tasks')); // Serve static files from the 'tasks' folder
app.use(express.static('public')); // Serve static files from the 'public' folder

// Site 1: Text Editor
app.post('/saveTask', (req, res) => {
  const { headline, dueDate, progress, description } = req.body;
  const taskId = uuid.v4();
  const task = { taskId, headline, dueDate, progress, description };
  fs.writeFileSync(`tasks/${taskId}.json`, JSON.stringify(task));
  res.send('Task saved successfully!');
});

app.put('/updateTask/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { headline, dueDate, progress, description } = req.body;
  const task = { taskId, headline, dueDate, progress, description };
  fs.writeFileSync(`tasks/${taskId}.json`, JSON.stringify(task));
  res.send('Task updated successfully!');
});

app.get('/loadTasks', (req, res) => {
  const files = fs.readdirSync('./tasks');
  const tasks = files.filter(file => file.endsWith('.json')).map(file => {
    const data = fs.readFileSync(`tasks/${file}`, 'utf-8');
    return JSON.parse(data);
  });
  res.json(tasks);
});

// Site 2: Front End
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/editor', (req, res) => {
  res.sendFile(__dirname + '/public/editor.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
