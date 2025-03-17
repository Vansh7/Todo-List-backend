const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your MongoDB Atlas connection string
//mongoose.connect('mongodb+srv://vansh7:Namdev%407@todo-list.b1pvi.mongodb.net/?retryWrites=true&w=majority&appName=Todo-list', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://vansh7:Namdev%407@todo-list.b1pvi.mongodb.net/?retryWrites=true&w=majority&appName=Todo-list')
  .then(() => console.log('CONNECTED TO DATABASE SUCCESSFULLY'))
  .catch((error) => console.error('COULD NOT CONNECT TO DATABASE:', error.message));

// const todoSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   tags: [String],
//   priority: String,
//   users: [String],
//   notes: [String],
//   createdAt: { type: Date, default: Date.now }
// });
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    priority: String,
    users: [String],
    notes: [String]
  }, { timestamps: true });
  

const userSchema = new mongoose.Schema({
  username: String
});

const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('User', userSchema);

// Pre-create users if not exist
User.find().then(users => {
  if (users.length < 5) {
    const usernames = ['alice', 'bob', 'charlie', 'dave', 'eve'];
    usernames.forEach(username => {
      User.findOne({ username }).then(u => {
        if (!u) {
          new User({ username }).save();
        }
      });
    });
  }
});

// Todo Routes
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.get('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.json(todo);
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.post('/api/todos/:id/notes', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.notes.push(req.body.note);
  await todo.save();
  res.json(todo);
});

app.get('/api/todos/user/:username', async (req, res) => {
  const todos = await Todo.find({ users: req.params.username });
  res.json(todos);
});

// User Routes
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
