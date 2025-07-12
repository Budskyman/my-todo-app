const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// ✅ Cek URL dari .env
const mongoURI = process.env.MONGO_URL;
console.log("🌐 MongoDB URL:", mongoURI);

// ✅ Koneksi ke MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Terhubung ke MongoDB!'))
  .catch(err => console.error('❌ Gagal konek MongoDB:', err));

// === 🔤 Schema & Model ===
const todoSchema = new mongoose.Schema({
  text: String,
  dueDate: Date,
  notified: Boolean
});
const Todo = mongoose.model('Todo', todoSchema);

// === 🛠 Middleware & Setup ===
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// === 🌐 GET Homepage ===
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render("index", { todos });
  } catch (err) {
    console.error("❌ Error saat ambil data:", err);
    res.status(500).send("Gagal mengambil data tugas");
  }
});

// === ➕ Tambah Tugas ===
app.post('/add', async (req, res) => {
  const { todo, dueDate } = req.body;
  if (todo && dueDate) {
    try {
      const newTask = new Todo({
        text: todo,
        dueDate: new Date(dueDate),
        notified: false
      });
      await newTask.save();
      console.log("✅ Tugas ditambahkan:", newTask);
    } catch (err) {
      console.error("❌ Gagal tambah tugas:", err);
    }
  }
  res.redirect('/');
});

// === ❌ Hapus Tugas Berdasarkan Index ===
app.post('/delete', async (req, res) => {
  try {
    const index = parseInt(req.body.index);
    const todos = await Todo.find();
    if (!isNaN(index) && todos[index]) {
      await Todo.deleteOne({ _id: todos[index]._id });
      console.log("🗑️ Tugas dihapus:", todos[index].text);
    }
  } catch (err) {
    console.error("❌ Gagal hapus tugas:", err);
  }
  res.redirect('/');
});

// === ⚠️ Error Middleware ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// === 🚀 Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
